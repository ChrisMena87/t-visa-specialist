// Eval runner para specialists del motor de análisis.
//
// Carga el skill (system prompt) + casos del golden set y compara el output
// del modelo contra las assertions de cada caso. Output: pretty-print en
// consola + snapshot JSON en runs/{timestamp}.json + diff vs baseline.json
// si existe.
//
// Uso:
//   node scripts/eval-skill.mjs --skill visa-t                    # full run (métrico)
//   node scripts/eval-skill.mjs --skill visa-t --dry-run          # parse-only casos, no API
//   node scripts/eval-skill.mjs --skill visa-t --limit 3          # solo primeros 3
//   node scripts/eval-skill.mjs --skill visa-t --case 005         # solo el 005
//   node scripts/eval-skill.mjs --skill visa-t --save-baseline    # promover a baseline
//   node scripts/eval-skill.mjs --skill visa-t --no-cache         # sin prompt caching
//   node scripts/eval-skill.mjs --skill visa-t --diagnostic       # modo diagnóstico (worklist, sin score)
//   node scripts/eval-skill.mjs --skill visa-t --reparse          # re-parsear el último run (en seco, sin API)
//   node scripts/eval-skill.mjs --skill visa-t --reparse --reparse-file <run.json> --diagnostic  # worklist en seco
//
// Requiere (solo corrida en vivo): ANTHROPIC_API_KEY en env. Modelo default: claude-sonnet-4-6.
//
// Estampa la versión del prompt, parsea el campo `scenario:`, asevera `basis` no-vacío,
// re-deriva el header desde la cobertura, y agrega el modo --diagnostic que produce el
// worklist de la re-auditoría del golden en vez de un score.
//
// Hogar: tools/eval-runner/ — es TOOLING, no el agente.
//
// Spec del formato de caso: ver evals/README.md ("Construí tu propio golden").

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, basename } from "node:path";
import { parseArgs } from "node:util";
import yaml from "js-yaml";
import Anthropic from "@anthropic-ai/sdk";

const here = dirname(fileURLToPath(import.meta.url));
// El runner vive en tools/eval-runner/. `root` = raíz del repo (dos niveles arriba) —
// de ahí resuelven --prompt-file relativo y evals/.
const root = join(here, "..", "..");

// ============================================================================
// CLI
// ============================================================================

const { values: args } = parseArgs({
  options: {
    skill: { type: "string", default: "visa-t" },
    "dry-run": { type: "boolean", default: false },
    limit: { type: "string" },
    case: { type: "string" },
    "save-baseline": { type: "boolean", default: false },
    "no-cache": { type: "boolean", default: false },
    model: { type: "string", default: "claude-sonnet-4-6" },
    "max-tokens": { type: "string", default: "4096" },
    diagnostic: { type: "boolean", default: false },
    reparse: { type: "boolean", default: false },
    "reparse-file": { type: "string" },
    "prompt-file": { type: "string" },
    "prompt-version": { type: "string" },
  },
});

const SKILL = args.skill;
const DRY_RUN = args["dry-run"];
const LIMIT = args.limit ? Number(args.limit) : null;
const CASE_FILTER = args.case || null;
const SAVE_BASELINE = args["save-baseline"];
const USE_CACHE = !args["no-cache"];
const MODEL = args.model;
const MAX_TOKENS = Number(args["max-tokens"]);
const DIAGNOSTIC = args.diagnostic;
// --reparse (bare) → "__latest__" (último run); --reparse-file <path> lo fija.
const REPARSE = args.reparse ? (args["reparse-file"] || "__latest__") : null;
// Override del prompt (evidence-v1 = 2 archivos ensamblados A+B): --prompt-file apunta a un
// prompt ya ensamblado; --prompt-version estampa la etiqueta (evidence-v1 no matchea "Versión: N").
const PROMPT_FILE = args["prompt-file"] || null;
const PROMPT_VERSION = args["prompt-version"] || null;

// ============================================================================
// Paths
// ============================================================================

// El prompt de este agente son DOS archivos (prompt/reasoning.md + prompt/contract.md) que
// se ensamblan con tools/eval-runner/assemble-prompt.mjs — por eso este runner siempre se
// invoca con --prompt-file (ver README.md). Sin --prompt-file no hay fallback de un solo
// archivo que tenga sentido; el error abajo lo dice explícito en vez de resolver a ciegas.
const skillPath = PROMPT_FILE
  ? (PROMPT_FILE.startsWith("/") ? PROMPT_FILE : join(root, PROMPT_FILE))
  : null;
const casesDir = join(root, "evals", "golden");
const runsDir = join(root, "evals", "runs");
const baselinePath = join(root, "evals", "baseline.json");

// ============================================================================
// Load
// ============================================================================

function loadSkill() {
  if (!skillPath) {
    throw new Error(
      "Falta --prompt-file. Este agente ensambla su prompt desde dos archivos " +
      "(prompt/reasoning.md + prompt/contract.md) — corré primero " +
      "tools/eval-runner/assemble-prompt.mjs y pasá su salida con --prompt-file."
    );
  }
  if (!existsSync(skillPath)) throw new Error(`Skill not found: ${skillPath}`);
  return readFileSync(skillPath, "utf8");
}

function extractPromptVersion(systemPrompt) {
  // Δ1 (Paso 2): el header del prompt declara "Versión: 3.5h — 2026-06-01".
  // Tomamos la PRIMERA ocurrencia (la activa). Estamparla en el snapshot es
  // lo que hoy falta — por eso runs/ no distingue v3.5h de v3.5i (lección
  // del episodio de ADR-037). No es interpretación: es un dato verificable.
  if (PROMPT_VERSION) return PROMPT_VERSION;
  const m = systemPrompt.match(/versi[oó]n:\s*([0-9][^\s—–\-\n]*)/i);
  return m ? m[1] : "unknown";
}

function loadRunSnapshot(pathArg) {
  // --reparse: cargar un snapshot persistido para re-parsear su rawOutput sin
  // API (desarrollo en seco del parser, Fork B). "__latest__" = último run.
  let p = pathArg;
  if (pathArg === "__latest__") {
    if (!existsSync(runsDir)) throw new Error(`No hay runs/ para --reparse (${runsDir})`);
    const files = readdirSync(runsDir).filter((f) => f.endsWith(".json")).sort();
    if (files.length === 0) throw new Error("runs/ vacío — nada para --reparse");
    p = join(runsDir, files[files.length - 1]);
  } else if (!existsSync(p)) {
    const alt = join(runsDir, pathArg);
    if (existsSync(alt)) p = alt;
    else throw new Error(`Run no encontrado: ${pathArg}`);
  }
  return { path: p, data: JSON.parse(readFileSync(p, "utf8")) };
}

function loadCases() {
  if (!existsSync(casesDir)) throw new Error(`Cases dir not found: ${casesDir}`);
  const files = readdirSync(casesDir)
    .filter((f) => f.endsWith(".md"))
    .sort();
  return files.map((f) => {
    const raw = readFileSync(join(casesDir, f), "utf8");
    return { file: f, ...parseCase(raw) };
  });
}

function parseCase(raw) {
  // Frontmatter entre los primeros dos `---` líneas. Body = lo que viene después.
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error("Invalid case file — no frontmatter");
  const frontmatter = yaml.load(m[1]);
  const body = m[2];
  // Extraer el intake del bloque ```...```
  const intakeMatch = body.match(/```\n([\s\S]*?)\n```/);
  const intake = intakeMatch ? intakeMatch[1] : body.trim();
  return { fm: frontmatter, body, intake };
}

function loadBaseline() {
  if (!existsSync(baselinePath)) return null;
  try {
    return JSON.parse(readFileSync(baselinePath, "utf8"));
  } catch (e) {
    console.warn(`Warning: baseline.json corrupto, ignorando. (${e.message})`);
    return null;
  }
}

// ============================================================================
// Anthropic call
// ============================================================================

async function callSkill(client, systemPrompt, intakeText) {
  const sys = USE_CACHE
    ? [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }]
    : systemPrompt;

  const t0 = Date.now();
  const resp = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: sys,
    messages: [{ role: "user", content: intakeText }],
  });
  const latencyMs = Date.now() - t0;

  const text = resp.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  return {
    text,
    usage: resp.usage,
    latencyMs,
    stopReason: resp.stop_reason,
  };
}

// ============================================================================
// Parse skill output
// ============================================================================

// Mapeo de `header` al texto del header del lane que emite el skill al
// inicio del output (sección "Síntesis técnica"). Taxonomy nueva post-
// 3 estados del lane (no un veredicto adjudicativo): cada estado describe
// el estado del caso DENTRO de Visa T. Ver evals/README.md §`header`
// para definiciones.
//
// El parser primero localiza el header "Síntesis técnica:" y aplica las
// patterns sobre esa línea. Esto evita falsos positivos por menciones
// de los términos en el body (atención del abogado, etc.).
const SYNTHESIS_HEADER = /s[ií]ntesis\s+t[eé]cnica\s*[:\*]*[\s`*]*([^\n`*]+)/i;

const HEADER_PATTERNS_V35H = {
  RESCREENING_NECESARIO: /rescreening\s+necesario/i,
  SIN_ELEMENTOS_VISA_T: /sin\s+elementos\s+de\s+visa\s+t/i,
  ELEMENTOS_COMPLETOS_VISA_T: /elementos\s+de\s+visa\s+t\s+completos/i,
};

// Patterns legacy v3.5g (7 categorías) — fallback para correr el runner
// contra outputs viejos durante migración. Si emerge un match en estas,
// el runner registra el resultado pero advierte como `legacy` en el
// snapshot para visibilidad.
const HEADER_PATTERNS_V35G_LEGACY = {
  HARDSHIP_REQUIERE_REFUERZO: /hardship\s+requiere\s+refuerzo/i,
  HARDSHIP_INSUFICIENTE: /hardship\s+insuficiente/i,
  INDICIOS_FUERTES: /indicios\s+fuertes/i,
  INDICIOS_PARCIALES: /indicios\s+parciales/i,
  BRIGHT_LINE_BAR: /bright[\-\s]line\s+bar/i,
  MULTIPLES_BARS: /m[úu]ltiples\s+bars/i,
  GAPS_ESPECIFICOS: /gaps\s+espec[íi]ficos/i,
};

// Patterns pre-v3.5g (taxonomy "VENDE/NO VENDE") — fallback aún más
// viejo. Se mantiene para que el runner siga ejecutándose contra
// snapshots históricos sin tronar.
const HEADER_PATTERNS_PRE_V35G = {
  VENDE_ALTA: /\bvende\s*t\s*[—\-–]\s*alta/i,
  VENDE_CAVEATS: /\bvende\s*t\s*[—\-–]\s*con\s*caveats/i,
  NO_VENDE_MULTI: /\bno\s*vende\s*t\b[^—\-–\n]*[—\-–][^—\-–\n]*\b(\d+|N|múltiples?|multiple)\s+escenarios/i,
  NO_VENDE_SINGLE: /\bno\s*vende\s*t\b/i,
  FALTA_INFO: /\bfalta\s+info\s+cr[ií]tica\b/i,
};

function extractHeader(output) {
  // Intentar extraer la línea de síntesis técnica primero
  const synthMatch = output.match(SYNTHESIS_HEADER);
  const targetText = synthMatch ? synthMatch[1] : output;

  // Taxonomy v3.5h (3 estados del lane, ADR-034 + ADR-035)
  for (const [name, pattern] of Object.entries(HEADER_PATTERNS_V35H)) {
    if (pattern.test(targetText)) return name;
  }

  // Fallback v3.5g (7 categorías): match pero advertir como legacy.
  // El caller (compareCase) chequea si el match cae en este set y
  // marca el assertion como mismatch con nota explicativa.
  for (const [name, pattern] of Object.entries(HEADER_PATTERNS_V35G_LEGACY)) {
    if (pattern.test(targetText)) return `LEGACY_V35G:${name}`;
  }

  // Fallback pre-v3.5g
  for (const [name, pattern] of Object.entries(HEADER_PATTERNS_PRE_V35G)) {
    if (pattern.test(output)) return `LEGACY_PRE_V35G:${name}`;
  }

  return null;
}

function extractScenarios(output) {
  // Bullets tipo "• 🚫 Smuggling..." o "- ⚠️ Labor trafficking..."
  // El skill puede usar •/-/* y los íconos ✅/⚠️/❌/🚫
  const lines = output.split("\n");
  const scenarios = [];
  const ICONS = ["✅", "⚠️", "❌", "🚫"];
  // Buscar la sección "Escenarios T evaluados" — tomar bullets hasta una línea vacía + sección nueva.
  let inSection = false;
  for (const line of lines) {
    if (/escenarios?\s+t\s+evaluados?:?/i.test(line)) {
      inSection = true;
      continue;
    }
    if (!inSection) continue;
    if (/^cobertura/i.test(line.trim()) || /^atenci[oó]n\s+del\s+abogado/i.test(line.trim())) {
      break;
    }
    const trimmed = line.trim().replace(/^[•\-*]\s*/, "");
    const icon = ICONS.find((i) => trimmed.startsWith(i));
    if (icon) {
      scenarios.push({ icon, line: trimmed });
    }
  }
  return scenarios;
}

function extractCoverage(output) {
  // Parser v3.5h: formato parseable estricto definido por ADR-035.
  // Cada elemento sigue el patrón:
  //   <Elemento> — state: <state>; basis: <basis>
  // Y para bright_line_no, dos campos adicionales:
  //   ; source_question: <Qn>; source_answer: <verbatim>
  //
  // Buscar dentro de "Cobertura detallada"; salir al llegar a la próxima
  // sección (Atención del abogado / Flag de referido / Próximo paso).
  //
  // Retorna por elemento:
  //   { state: "present"|"no_confirmado"|"bright_line_no"|"no_aplica",
  //     basis: string,
  //     source_question?: string,
  //     source_answer?: string }
  //
  // Si un elemento no se encuentra, el key no aparece en el objeto.
  // El caller (compareCase) detecta missing keys como assertion fail.
  const lines = output.split("\n");
  const cov = {};
  const LABELS = {
    acto: /^[\s\-•*]*\*{0,2}acto\*{0,2}\b/i,
    medios: /^[\s\-•*]*\*{0,2}medios\*{0,2}\b/i,
    fin: /^[\s\-•*]*\*{0,2}fin\b/i,
    presencia: /^[\s\-•*]*\*{0,2}presencia\*{0,2}\b/i,
    cooperacion: /^[\s\-•*]*\*{0,2}cooperaci[oó]n\*{0,2}\b/i,
    hardship: /^[\s\-•*]*\*{0,2}(extreme\s+)?hardship\*{0,2}\b/i,
  };
  // Parseable line: "<Elemento> — state: <state>; basis: <basis>; [...]"
  // Aceptar también guion ASCII (-) además de em-dash (—).
  const STATE_RE = /state:\s*([a-z_]+)/i;
  const BASIS_RE = /basis:\s*([^;]+?)(?:\.|;|$)/i;
  const SOURCE_Q_RE = /source_question:\s*([^;]+?)(?:\.|;|$)/i;
  const SOURCE_A_RE = /source_answer:\s*([^;]+?)(?:\.|;|$)/i;
  let inSection = false;
  for (const line of lines) {
    if (/cobertura(\s+detallada)?/i.test(line)) {
      inSection = true;
      continue;
    }
    if (!inSection) continue;
    if (
      /^[\s\-•*]*\*{0,2}atenci[oó]n\s+del\s+abogado/i.test(line.trim()) ||
      /^[\s\-•*]*\*{0,2}flag\s+de\s+referido/i.test(line.trim()) ||
      /^[\s\-•*]*\*{0,2}pr[oó]ximo\s+paso/i.test(line.trim())
    ) {
      break;
    }
    // Detectar etiqueta de elemento al inicio de la línea
    for (const [key, labelRe] of Object.entries(LABELS)) {
      if (labelRe.test(line)) {
        const stateMatch = line.match(STATE_RE);
        if (!stateMatch) continue;
        const state = stateMatch[1].toLowerCase();
        // Solo aceptar states válidos del ADR-035
        const validStates = ["present", "no_confirmado", "bright_line_no", "no_aplica"];
        if (!validStates.includes(state)) continue;
        const basisMatch = line.match(BASIS_RE);
        const entry = {
          state,
          basis: basisMatch ? basisMatch[1].trim() : null,
        };
        if (state === "bright_line_no") {
          const sqMatch = line.match(SOURCE_Q_RE);
          const saMatch = line.match(SOURCE_A_RE);
          if (sqMatch) entry.source_question = sqMatch[1].trim();
          if (saMatch) entry.source_answer = saMatch[1].trim();
        }
        // Solo asignar la primera vez (evita override por menciones posteriores)
        if (!(key in cov)) cov[key] = entry;
        break;
      }
    }
  }
  return cov;
}

function extractReferrals(output) {
  // Buscar la sección "Flag de referido" + cualquier mención de u-visa/vawa en el output completo.
  const lower = output.toLowerCase();
  return {
    has_u_visa: /\bu[- ]visa\b/.test(lower),
    has_vawa: /\bvawa\b/.test(lower),
  };
}

function extractScenario(output) {
  // Δ1 (Q-C3): el contrato formalizado agrega una primera línea dentro de
  // "Cobertura detallada":
  //   scenario: <tipo de T del escenario cubierto>
  // Los outputs viejos (pre-contrato) NO la traen → devolvemos null y el
  // caller lo marca; el parser tolera su ausencia, no rompe.
  const lines = output.split("\n");
  let inSection = false;
  for (const line of lines) {
    if (/cobertura(\s+detallada)?/i.test(line)) { inSection = true; continue; }
    if (!inSection) continue;
    const m = line.match(/^[\s\-•*]*\*{0,2}scenario\*{0,2}\s*[:—–\-]\s*(.+?)\s*$/i);
    if (m) return m[1].replace(/\*+$/, "").trim();
    if (
      /^[\s\-•*]*\*{0,2}atenci[oó]n\s+del\s+abogado/i.test(line.trim()) ||
      /^[\s\-•*]*\*{0,2}pr[oó]ximo\s+paso/i.test(line.trim())
    ) break;
  }
  return null;
}

function parseSkillOutput(output) {
  return {
    header: extractHeader(output),
    scenario: extractScenario(output),
    scenarios: extractScenarios(output),
    coverage: extractCoverage(output),
    referrals: extractReferrals(output),
    raw: output,
  };
}

function deriveHeader(coverage) {
  // Δ3 (Q-C1): re-derivar el header desde la cobertura por las reglas de
  // elección (ADR-035), sobre LOS SEIS elementos (Q-C2 — la jerarquía la hace
  // la cascada de estados, no un subconjunto). Se compara con el header
  // emitido: mismatch = razonamiento inconsistente (diagnóstico gratis).
  // No decide golden vs prompt.
  const states = Object.values(coverage).map((e) => e && e.state).filter(Boolean);
  if (states.length === 0) return null;
  if (states.includes("no_confirmado")) return "RESCREENING_NECESARIO";
  if (states.includes("bright_line_no")) return "SIN_ELEMENTOS_VISA_T";
  if (states.every((s) => s === "no_aplica")) return "SIN_ELEMENTOS_VISA_T";
  if (states.every((s) => s === "present" || s === "no_aplica") && states.includes("present"))
    return "ELEMENTOS_COMPLETOS_VISA_T";
  return null; // combinación no resoluble por las reglas → sin penalización
}

// ============================================================================
// Assertions
// ============================================================================

function assertHeader(fm, parsed) {
  // El campo del frontmatter pasó de `verdict_class` (v3.5g) a `header`
  // (v3.5h). Aceptamos ambos por compat durante la migración — si el
  // golden todavía tiene `verdict_class`, lo leemos pero advertimos.
  const expected = fm.header ?? fm.verdict_class;
  const actual = parsed.header;
  return {
    name: "header",
    expected,
    actual,
    pass: expected === actual,
    severity: "hard",
  };
}

function assertScenarios(fm, parsed) {
  // Para cada scenario_required, intentar matchearlo con alguno de los bullets
  // extraídos. El match se hace por (a) icon coincide y (b) al menos uno de
  // must_mention_any aparece en la línea del bullet.
  const results = [];
  const required = fm.scenarios_required || [];
  for (let i = 0; i < required.length; i++) {
    const req = required[i];
    const match = parsed.scenarios.find((s) => {
      if (s.icon !== req.verdict) return false;
      const lower = s.line.toLowerCase();
      const mentions = req.must_mention_any || [];
      return mentions.some((m) => lower.includes(m.toLowerCase()));
    });
    results.push({
      // SOFT: el relato del escenario es prosa libre; exigir el veredicto+keyword
      // literal como hard castiga redacción legítima con otras palabras y un parser
      // que solo ve el icono a inicio de línea (lección it.2: 011/013 con coverage
      // 6/6 correcto fallaban solo acá). El eje de estados —la cobertura— sigue hard;
      // la síntesis narrativa es señal de calidad, no gate.
      name: `scenario[${i}].${req.type}`,
      expected: `${req.verdict} + any of [${(req.must_mention_any || []).slice(0, 3).join(", ")}...]`,
      actual: match ? `${match.icon} ${match.line.slice(0, 80)}...` : "(no match found)",
      pass: !!match,
      severity: "soft",
    });
  }
  return results;
}

function assertCoverage(fm, parsed) {
  // En v3.5h, el valor esperado de cada elemento es uno de los 4 states
  // textuales (`present`/`no_confirmado`/`bright_line_no`/`no_aplica`).
  // El parser extrae un objeto `{state, basis, source_question?, source_answer?}`
  // por elemento. La comparación es state-a-state.
  //
  // Para `bright_line_no`, además se verifica que el output incluya
  // `source_question` y `source_answer` (ADR-035 §"Reglas de forma" — sin
  // ancla a pregunta dispositiva, NO es bright-line).
  //
  // El campo opcional `coverage_bright_line_anchors` del frontmatter
  // permite assertar el valor específico de source_question/source_answer
  // por elemento.
  const results = [];
  const expected = fm.coverage || {};
  const anchors = fm.coverage_bright_line_anchors || {};
  for (const key of Object.keys(expected)) {
    const exp = expected[key];
    const actEntry = parsed.coverage[key];
    const actState = actEntry?.state ?? "(missing)";
    results.push({
      name: `coverage.${key}.state`,
      expected: exp,
      actual: actState,
      pass: exp === actState,
      severity: "hard",
    });
    // Δ2: `basis` es obligatorio en TODO estado (contrato §2.2). Assertion
    // ESTRUCTURAL — presencia/no-vacío, nunca contenido (Q-C5). No aplica a
    // elementos que el parser no encontró (actState = "(missing)" ya lo cubre
    // el assertion de state).
    if (actEntry) {
      const basisText = actEntry.basis;
      const hasBasis = !!(basisText && String(basisText).trim());
      results.push({
        name: `coverage.${key}.basis_present`,
        expected: "basis no-vacío",
        actual: hasBasis ? "present" : "MISSING",
        pass: hasBasis,
        severity: "hard",
      });
    }
    // Si esperamos bright_line_no, validar también que el output incluya
    // source_question + source_answer (presencia, no valor exacto a menos
    // que el frontmatter lo declare en coverage_bright_line_anchors).
    if (exp === "bright_line_no") {
      const hasSourceQ = !!actEntry?.source_question;
      const hasSourceA = !!actEntry?.source_answer;
      results.push({
        name: `coverage.${key}.bright_line_anchor_present`,
        expected: "source_question + source_answer presentes",
        actual: `source_question=${hasSourceQ ? "yes" : "MISSING"}, source_answer=${hasSourceA ? "yes" : "MISSING"}`,
        pass: hasSourceQ && hasSourceA,
        severity: "hard",
      });
      // Si el frontmatter declara anchors específicos, comparar
      const declared = anchors[key];
      if (declared) {
        if (declared.source_question) {
          results.push({
            name: `coverage.${key}.source_question`,
            expected: declared.source_question,
            actual: actEntry?.source_question ?? "(missing)",
            pass: actEntry?.source_question === declared.source_question,
            severity: "hard",
          });
        }
        if (declared.source_answer) {
          results.push({
            name: `coverage.${key}.source_answer`,
            expected: declared.source_answer,
            actual: actEntry?.source_answer ?? "(missing)",
            pass: actEntry?.source_answer === declared.source_answer,
            severity: "hard",
          });
        }
      }
    }
  }
  return results;
}

function assertReferrals(fm, parsed) {
  const results = [];
  const ref = fm.referrals || {};
  const must = ref.must_include_any_of || [];
  if (must.length > 0) {
    // Cualquiera de las variantes debe matchear u_visa o vawa
    const hasU = must.some((m) => /^u[- ]?visa$/i.test(m)) && parsed.referrals.has_u_visa;
    const hasV = must.some((m) => /^vawa$/i.test(m)) && parsed.referrals.has_vawa;
    const matched = hasU || hasV;
    results.push({
      name: "referrals.must_include_any_of",
      expected: must.join("|"),
      actual: `u-visa=${parsed.referrals.has_u_visa}, vawa=${parsed.referrals.has_vawa}`,
      pass: matched,
      severity: "hard",
    });
  }
  const mustNot = ref.must_not_include || [];
  for (const m of mustNot) {
    const isVawa = /^vawa$/i.test(m);
    const isU = /^u[- ]?visa$/i.test(m);
    const present = (isVawa && parsed.referrals.has_vawa) || (isU && parsed.referrals.has_u_visa);
    results.push({
      name: `referrals.must_not_include[${m}]`,
      expected: "absent",
      actual: present ? "present" : "absent",
      pass: !present,
      severity: "hard",
    });
  }
  return results;
}

function assertSoft(fm, parsed) {
  const results = [];
  const soft = fm.soft || {};
  const lower = parsed.raw.toLowerCase();
  for (const phrase of soft.should_mention || []) {
    const hit = lower.includes(phrase.toLowerCase());
    results.push({
      name: `soft.should_mention[${phrase.slice(0, 40)}]`,
      expected: "present",
      actual: hit ? "present" : "absent",
      pass: hit,
      severity: "soft",
    });
  }
  for (const phrase of soft.should_not_mention || []) {
    const hit = lower.includes(phrase.toLowerCase());
    results.push({
      name: `soft.should_not_mention[${phrase.slice(0, 40)}]`,
      expected: "absent",
      actual: hit ? "present" : "absent",
      pass: !hit,
      severity: "soft",
    });
  }
  return results;
}

function assertHeaderRederivation(parsed) {
  // Δ3 (Q-C1): consistencia interna header EMITIDO ↔ header RE-DERIVADO de la
  // cobertura. Solo falla cuando es derivable Y difiere (mismatch = razonamiento
  // inconsistente). No derivable, o header legacy, → no penaliza. No compara
  // contra el golden — es un chequeo del output consigo mismo.
  const derived = deriveHeader(parsed.coverage);
  const emitted = parsed.header;
  const applicable = derived !== null && emitted !== null && !String(emitted).startsWith("LEGACY");
  return {
    name: "header.rederived_consistency",
    expected: applicable ? derived : "(no derivable — sin penalización)",
    actual: emitted,
    pass: applicable ? derived === emitted : true,
    severity: "hard",
  };
}

function evaluateCase(caseObj, parsed) {
  const assertions = [
    assertHeader(caseObj.fm, parsed),
    assertHeaderRederivation(parsed),
    ...assertScenarios(caseObj.fm, parsed),
    ...assertCoverage(caseObj.fm, parsed),
    ...assertReferrals(caseObj.fm, parsed),
    ...assertSoft(caseObj.fm, parsed),
  ];
  const hard = assertions.filter((a) => a.severity === "hard");
  const soft = assertions.filter((a) => a.severity === "soft");
  const hardPass = hard.filter((a) => a.pass).length;
  const hardTotal = hard.length;
  const softPass = soft.filter((a) => a.pass).length;
  const softTotal = soft.length;
  const status = hardPass === hardTotal ? (softPass === softTotal ? "pass" : "warn") : "fail";
  return { assertions, hardPass, hardTotal, softPass, softTotal, status };
}

// ============================================================================
// Pretty print
// ============================================================================

const C = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

function statusIcon(s) {
  if (s === "pass") return `${C.green}✓${C.reset}`;
  if (s === "warn") return `${C.yellow}⚠${C.reset}`;
  if (s === "fail") return `${C.red}✗${C.reset}`;
  return "?";
}

function printCaseSummary(caseObj, evalResult) {
  const id = caseObj.fm.id || basename(caseObj.file, ".md");
  const icon = statusIcon(evalResult.status);
  const hardStr = `${evalResult.hardPass}/${evalResult.hardTotal} hard`;
  const softStr = evalResult.softTotal > 0 ? `, ${evalResult.softPass}/${evalResult.softTotal} soft` : "";
  console.log(`  ${icon} ${id.padEnd(45)} (${hardStr}${softStr})`);
  if (evalResult.status !== "pass") {
    for (const a of evalResult.assertions) {
      if (a.pass) continue;
      const sevIcon = a.severity === "hard" ? `${C.red}✗${C.reset}` : `${C.yellow}⚠${C.reset}`;
      console.log(`      ${sevIcon} ${C.dim}${a.name}${C.reset} — expected ${C.cyan}${trunc(a.expected, 60)}${C.reset}, got ${C.gray}${trunc(a.actual, 60)}${C.reset}`);
    }
  }
}

function trunc(v, n) {
  const s = String(v);
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

// ============================================================================
// Baseline diff
// ============================================================================

function diffBaseline(current, baseline) {
  if (!baseline) return { regressions: [], improvements: [] };
  const baseById = new Map(baseline.cases.map((c) => [c.id, c.status]));
  const regressions = [];
  const improvements = [];
  for (const c of current.cases) {
    const prev = baseById.get(c.id);
    if (prev === "pass" && c.status !== "pass") regressions.push({ id: c.id, prev, curr: c.status });
    if (prev !== "pass" && prev && c.status === "pass") improvements.push({ id: c.id, prev, curr: c.status });
  }
  return { regressions, improvements };
}

// ============================================================================
// Worklist (modo diagnóstico — ADR-037 R2.3)
// ============================================================================

function buildWorklistItems(resultCase, promptVersion) {
  // Δ4: cada hard-assertion fallida es un DIFF golden↔prompt = un caso abierto
  // para la re-auditoría del Paso 3. Ni golden ni prompt se presumen correctos
  // (R1); la adjudicación humana llena el andamio de autoría (R3).
  if (!resultCase.assertions) return [];
  return resultCase.assertions
    .filter((a) => !a.pass && a.severity === "hard")
    .map((a) => ({
      caso: resultCase.id,
      campo: a.name,
      golden: trunc(a.expected, 200),
      prompt: trunc(a.actual, 200),
      promptVersion,
    }));
}

function renderWorklist(items, meta) {
  const L = [];
  L.push(`# Worklist de re-auditoría del golden — Paso 3`);
  L.push("");
  L.push(`> Generado por el eval-runner en **modo diagnóstico** (ADR-037 R2.3). Cada ítem es un`);
  L.push(`> **caso abierto**: ni el golden ni el prompt se presumen correctos (R1). La adjudicación la`);
  L.push(`> hace un humano abriendo el intake crudo y llenando el andamio de autoría (R3). **No es un score.**`);
  L.push("");
  if (String(meta.source).toLowerCase().includes("reparse")) {
    L.push(`> **⚠️ MATERIAL DE DESARROLLO — NO es el diagnóstico del Paso 3.** Salió de re-parsear una`);
    L.push(`> corrida vieja (pre-\`scenario:\`, episodio ADR-037) para validar el parser en seco. El`);
    L.push(`> diagnóstico real del Paso 3 sale de la corrida de generación fresca contra v3.5h.`);
    L.push("");
  }
  L.push(`- skill: ${meta.skill}`);
  L.push(`- prompt_version: ${meta.promptVersion}`);
  L.push(`- fuente: ${meta.source}`);
  L.push(`- generado: ${meta.ts}`);
  L.push(`- diffs: ${items.length}`);
  L.push("");
  if (items.length === 0) {
    L.push(`_Sin diffs golden↔prompt en esta corrida._`);
    return L.join("\n") + "\n";
  }
  const byCase = new Map();
  for (const it of items) {
    if (!byCase.has(it.caso)) byCase.set(it.caso, []);
    byCase.get(it.caso).push(it);
  }
  for (const [caso, its] of byCase) {
    L.push(`## ${caso}`);
    L.push("");
    for (const it of its) {
      L.push(`### ${it.campo}`);
      L.push(`- golden: \`${it.golden}\``);
      L.push(`- prompt(${it.promptVersion}): \`${it.prompt}\``);
      L.push(`- adjudicación (Paso 3 — llenar):`);
      L.push(`  - changed_by: `);
      L.push(`  - evidence: `);
      L.push(`  - reason: `);
      L.push(`  - date: `);
      L.push(`  - approved_by: `);
      L.push("");
    }
  }
  return L.join("\n") + "\n";
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const skillSystemPrompt = loadSkill();
  let cases = loadCases();

  if (CASE_FILTER) {
    cases = cases.filter((c) => (c.fm.id || c.file).includes(CASE_FILTER));
    if (cases.length === 0) {
      console.error(`No matching case for filter: ${CASE_FILTER}`);
      process.exit(1);
    }
  }
  if (LIMIT) cases = cases.slice(0, LIMIT);

  console.log(`${C.bold}=== ${SKILL} eval — ${new Date().toISOString()} ===${C.reset}`);
  console.log(`Skill: ${skillPath ? skillPath.replace(root, ".") : "(falta --prompt-file)"}`);
  console.log(`Cases: ${cases.length} from ${casesDir.replace(root, ".")}`);
  console.log(`Model: ${MODEL}, max_tokens: ${MAX_TOKENS}, cache: ${USE_CACHE ? "on" : "off"}`);
  if (DRY_RUN) console.log(`${C.yellow}DRY RUN${C.reset} — no API calls, parse-only validation\n`);

  // Validar parsing primero (incluso en dry-run)
  console.log(`\n${C.bold}Phase 1 — Parsing case files${C.reset}`);
  for (const c of cases) {
    const id = c.fm.id || basename(c.file, ".md");
    const fmKeys = Object.keys(c.fm);
    // v3.5h usa `header` como nombre del campo del frontmatter; aceptamos
    // `verdict_class` (v3.5g) como fallback compat durante la migración.
    const required = ["id", "scenarios_required", "coverage"];
    const hasHeaderField = fmKeys.includes("header") || fmKeys.includes("verdict_class");
    if (!hasHeaderField) required.push("header (or legacy verdict_class)");
    const missing = required.filter((k) => !fmKeys.includes(k));
    if (missing.length > 0) {
      console.log(`  ${C.red}✗${C.reset} ${id.padEnd(45)} missing: ${missing.join(", ")}`);
    } else {
      console.log(`  ${C.green}✓${C.reset} ${id.padEnd(45)} (${c.intake.length} chars intake, ${(c.fm.scenarios_required || []).length} scenarios)`);
    }
  }

  if (DRY_RUN) {
    console.log(`\n${C.bold}Dry run complete — exit without API calls.${C.reset}`);
    return;
  }

  const promptVersion = extractPromptVersion(skillSystemPrompt);
  console.log(`Prompt version: ${C.cyan}${promptVersion}${C.reset}`);
  if (DIAGNOSTIC) {
    console.log(`${C.yellow}MODO DIAGNÓSTICO${C.reset} — ADR-037 R2.3: sin score X/N, sin baseline; produce worklist. Ni golden ni prompt se presumen correctos (R1).`);
  }

  const results = [];
  let totalIn = 0, totalOut = 0, totalCacheRead = 0, totalCacheWrite = 0;
  let liveRun = false;
  let reparseMeta = null;
  // Label de versión honesto: en reparse los outputs viejos NO tienen versión
  // estampada (esa es la deuda que Δ1 arregla hacia adelante) → no asumir la del
  // archivo de hoy. Se usa la versión del run si la trae, o "pre-estampado".
  let reparseRunVersion = null;

  if (REPARSE) {
    // Δ1 en seco (Fork B): re-parsear rawOutput persistido, sin API. Fuente de
    // desarrollo del parser (scenario:, rederivación) contra outputs viejos.
    const { path: runPath, data: runData } = loadRunSnapshot(REPARSE);
    reparseRunVersion = runData.prompt_version || null;
    // Condición del director: marcar el origen — corrida vieja (pre-scenario,
    // episodio ADR-037) = MATERIAL DE DESARROLLO, no el diagnóstico del Paso 3.
    reparseMeta = `reparse de ${basename(runPath)} (timestamp ${runData.timestamp || "?"}, pre-scenario, episodio ADR-037) — MATERIAL DE DESARROLLO, no el diagnóstico del Paso 3`;
    console.log(`\n${C.bold}Re-parse (en seco, sin API)${C.reset} — fuente: ${runPath.replace(root, ".")}`);
    const byId = new Map(cases.map((c) => [c.fm.id || basename(c.file, ".md"), c]));
    for (const rc of runData.cases || []) {
      const c = byId.get(rc.id);
      if (!c) continue;
      if (!rc.rawOutput) {
        console.log(`  ${C.yellow}⚠${C.reset} ${rc.id.padEnd(45)} sin rawOutput en el run — skip`);
        results.push({ id: rc.id, file: rc.file, status: "error", error: "sin rawOutput" });
        continue;
      }
      const parsed = parseSkillOutput(rc.rawOutput);
      const evalRes = evaluateCase(c, parsed);
      results.push({
        id: rc.id, file: c.file, status: evalRes.status,
        hardPass: evalRes.hardPass, hardTotal: evalRes.hardTotal,
        softPass: evalRes.softPass, softTotal: evalRes.softTotal,
        assertions: evalRes.assertions,
        parsed: { header: parsed.header, scenario: parsed.scenario, coverage: parsed.coverage, referrals: parsed.referrals },
        rawOutput: rc.rawOutput,
      });
      printCaseSummary(c, evalRes);
    }
  } else {
    // Corrida en vivo (Fork B: genera fresco). Δ6 — último movimiento, go explícito.
    liveRun = true;
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error(`\n${C.red}ANTHROPIC_API_KEY not set — abort.${C.reset}`);
      process.exit(1);
    }
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    console.log(`\n${C.bold}Phase 2 — Running skill against cases${C.reset}`);
    for (const c of cases) {
      const id = c.fm.id || basename(c.file, ".md");
      process.stdout.write(`  ${C.dim}running ${id}…${C.reset}`);
      try {
        const callRes = await callSkill(client, skillSystemPrompt, c.intake);
        const parsed = parseSkillOutput(callRes.text);
        const evalRes = evaluateCase(c, parsed);
        results.push({
          id, file: c.file, status: evalRes.status,
          hardPass: evalRes.hardPass, hardTotal: evalRes.hardTotal,
          softPass: evalRes.softPass, softTotal: evalRes.softTotal,
          assertions: evalRes.assertions,
          usage: callRes.usage, latencyMs: callRes.latencyMs, stopReason: callRes.stopReason,
          parsed: { header: parsed.header, scenario: parsed.scenario, coverage: parsed.coverage, referrals: parsed.referrals },
          rawOutput: callRes.text,
        });
        totalIn += callRes.usage.input_tokens || 0;
        totalOut += callRes.usage.output_tokens || 0;
        totalCacheRead += callRes.usage.cache_read_input_tokens || 0;
        totalCacheWrite += callRes.usage.cache_creation_input_tokens || 0;
        process.stdout.write("\r\x1b[K");
        printCaseSummary(c, evalRes);
      } catch (e) {
        process.stdout.write("\r\x1b[K");
        console.log(`  ${C.red}✗${C.reset} ${id.padEnd(45)} ERROR: ${e.message}`);
        results.push({ id, file: c.file, status: "error", error: e.message });
      }
    }
  }

  const passN = results.filter((r) => r.status === "pass").length;
  const warnN = results.filter((r) => r.status === "warn").length;
  const failN = results.filter((r) => r.status === "fail").length;
  const errN = results.filter((r) => r.status === "error").length;

  // --------------------------------------------------------------------------
  // Δ4 — modo diagnóstico: worklist en vez de score (ADR-037 R2.3)
  // --------------------------------------------------------------------------
  if (DIAGNOSTIC) {
    // En reparse, el output evaluado NO es de la versión del archivo de hoy;
    // usar la versión estampada del run, o "pre-estampado" si no la trae.
    const versionLabel = REPARSE ? (reparseRunVersion || "pre-estampado (desconocida)") : promptVersion;
    const items = results.flatMap((r) => buildWorklistItems(r, versionLabel));
    const casesWithDiffs = results.filter((r) => buildWorklistItems(r, versionLabel).length > 0).length;
    console.log(`\n${C.bold}Diagnóstico${C.reset} — ${items.length} diffs golden↔prompt en ${results.length} casos ${C.dim}(NO es un score)${C.reset}.`);
    console.log(`  ${C.dim}casos con diffs: ${casesWithDiffs}/${results.length} · errores de parseo: ${errN}${C.reset}`);
    if (!existsSync(runsDir)) mkdirSync(runsDir, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const worklistPath = join(runsDir, `${ts}-worklist.md`);
    writeFileSync(worklistPath, renderWorklist(items, { skill: SKILL, promptVersion: versionLabel, source: REPARSE ? reparseMeta : "live", ts }));
    console.log(`\nWorklist (Paso 3): ${worklistPath.replace(root, ".")}`);
    if (liveRun) {
      const snapshotPath = join(runsDir, `${ts}.json`);
      // ADR-037 R2.3 hasta el bookkeeping: en modo diagnóstico NO se escribe
      // summary{pass/warn/fail} — un campo "fail" acá es trampa de lectura
      // futura (parecería un score). Se escribe un summary NEUTRAL de conteos.
      writeFileSync(snapshotPath, JSON.stringify({
        timestamp: ts, skill: SKILL, model: MODEL, prompt_version: promptVersion, mode: "diagnostic", cache_used: USE_CACHE,
        diagnostic_summary: { diff_count: items.length, cases_with_diffs: casesWithDiffs, parse_errors: errN, total: results.length },
        tokens: { input: totalIn, output: totalOut, cache_read: totalCacheRead, cache_write: totalCacheWrite },
        cases: results,
      }, null, 2));
      console.log(`Snapshot: ${snapshotPath.replace(root, ".")}`);
    }
    console.log(`\n${C.dim}Modo diagnóstico: sin exit-code de fallo, sin baseline. El golden se re-valida en el Paso 3 (ADR-037).${C.reset}`);
    return; // exit 0 — el diagnóstico nunca "falla" como métrica
  }

  // --------------------------------------------------------------------------
  // Modo métrico (gate: SOLO con golden re-validado — Paso 5)
  // --------------------------------------------------------------------------
  console.log(`\n${C.bold}Summary${C.reset}`);
  console.log(`  ${C.green}${passN} pass${C.reset}, ${C.yellow}${warnN} warn${C.reset}, ${C.red}${failN} fail${C.reset}, ${errN} error  (total ${results.length})`);
  if (liveRun) console.log(`  Tokens: in=${totalIn}, out=${totalOut}, cache_read=${totalCacheRead}, cache_write=${totalCacheWrite}`);

  const baseline = loadBaseline();
  const { regressions, improvements } = diffBaseline({ cases: results }, baseline);
  if (baseline) {
    console.log(`\n${C.bold}vs baseline${C.reset}`);
    if (regressions.length === 0 && improvements.length === 0) {
      console.log(`  ${C.dim}no changes${C.reset}`);
    } else {
      for (const r of regressions) console.log(`  ${C.red}↓ regression${C.reset} ${r.id}: ${r.prev} → ${r.curr}`);
      for (const i of improvements) console.log(`  ${C.green}↑ improved${C.reset} ${i.id}: ${i.prev} → ${i.curr}`);
    }
  } else {
    console.log(`\n${C.dim}(no baseline.json yet — pass --save-baseline to create one)${C.reset}`);
  }

  if (liveRun) {
    if (!existsSync(runsDir)) mkdirSync(runsDir, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const snapshotPath = join(runsDir, `${ts}.json`);
    const snapshot = {
      timestamp: ts, skill: SKILL, model: MODEL, prompt_version: promptVersion, mode: "metric", cache_used: USE_CACHE,
      summary: { pass: passN, warn: warnN, fail: failN, error: errN, total: results.length },
      tokens: { input: totalIn, output: totalOut, cache_read: totalCacheRead, cache_write: totalCacheWrite },
      cases: results,
    };
    writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));
    console.log(`\nSnapshot: ${snapshotPath.replace(root, ".")}`);
    if (SAVE_BASELINE) {
      writeFileSync(baselinePath, JSON.stringify(snapshot, null, 2));
      console.log(`${C.bold}Baseline updated${C.reset}: ${baselinePath.replace(root, ".")}`);
    } else {
      console.log(`${C.dim}To promote to baseline: re-run with --save-baseline${C.reset}`);
    }
  }

  // Exit code: 1 if any hard fails — solo en corrida métrica en vivo (útil para CI).
  if (liveRun && (failN > 0 || errN > 0)) process.exit(1);
}

main().catch((e) => {
  console.error(`\n${C.red}Fatal:${C.reset} ${e.message}`);
  console.error(e.stack);
  process.exit(2);
});
