#!/usr/bin/env node
// canon-watch — vigilante de frescura del canon legal embebido.
//
// REPORTA drift. NUNCA actualiza el canon por su cuenta — la actualización real
// exige verificación verbatim contra la fuente cruda + gate humano antes de tocar
// el canon embebido. Este script es un detector, no un editor.
//
// Cubre lo automatizable vía API oficial:
//   - CFR: eCFR versioner API.
//   - USC: govinfo.gov (GPO), edición anual oficial.
// Policy Manual y case-law NO tienen API pública equivalente — ver
// corpus/MANIFEST.md § "Vigilancia del canon" para la alternativa recomendada
// (revisión manual periódica + alertas de CourtListener).
//
// Uso (desde la raíz del repo): node tools/canon-watch/check-canon-freshness.mjs
// Exit code: 0 si todo OK; 1 si hay DRIFT, REVISAR, o ERROR en alguna pieza
// (para que un cron lo trate como señal de "hay que mirar esto").

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const here = dirname(fileURLToPath(import.meta.url));

const { values: args } = parseArgs({
  options: { agent: { type: "string", default: "." } },
});
const agentDir = join(here, "..", "..", args.agent);
const REFS = join(agentDir, "corpus", "references");

const UA = "canon-watch/1.0 (t-visa-specialist; monitor de frescura del canon legal)";

// ============================================================================
// Helpers
// ============================================================================

function frontmatter(text) {
  if (!text.startsWith("---")) return {};
  const end = text.indexOf("\n---\n", 4);
  if (end === -1) return {};
  const out = {};
  for (const line of text.slice(4, end).split("\n")) {
    const m = line.match(/^(\w+):\s*"?([^"\n]*)"?\s*$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

// Aproxima texto plano desde XML del eCFR: quita tags, decodifica entidades
// hex, colapsa espacios. No es un parser completo — suficiente para comparar
// longitud/contenido aproximado, no para re-derivar la estructura.
function stripXml(xml) {
  return xml
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x([0-9A-Fa-f]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#8217;/g, "’")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeMd(md) {
  return md
    .replace(/^---[\s\S]*?\n---\n/, "")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchSafe(url) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    const body = res.status === 200 ? await res.text() : null;
    return { ok: res.status === 200, status: res.status, finalUrl: res.url, body };
  } catch (err) {
    return { ok: false, status: 0, finalUrl: url, body: null, error: String(err) };
  }
}

// govinfo redirige silenciosamente a una página de error (HTTP 200 en la
// página amigable) cuando el content package pedido no existe — el status
// code solo no basta, hay que mirar la URL final.
function govinfoExists(fetchResult) {
  return fetchResult.ok && !fetchResult.finalUrl.includes("/error");
}

// ============================================================================
// CFR — eCFR versioner API
// ============================================================================

async function checkCFR() {
  const file = join(REFS, "regulations", "8-cfr-214-subpart-c-t-nonimmigrant-status.md");
  const raw = readFileSync(file, "utf8");
  const fm = frontmatter(raw);
  const result = {
    piece: "8 CFR 214 Subpart C (regulación)",
    file,
    declared: fm.edition,
    status: "OK",
    method: null,
    detail: "",
  };

  const titlesRes = await fetchSafe("https://www.ecfr.gov/api/versioner/v1/titles.json");
  if (!titlesRes.ok) {
    result.status = "ERROR";
    result.detail = `eCFR titles API respondió ${titlesRes.status} — no responde como la memoria del proyecto documenta (project_ecfr_api_canon_automation). No se asume un endpoint alternativo.`;
    return result;
  }

  let titles;
  try {
    titles = JSON.parse(titlesRes.body).titles;
  } catch {
    result.status = "ERROR";
    result.detail = "eCFR titles API devolvió un body que no parsea como el JSON esperado — schema cambió respecto de lo validado.";
    return result;
  }
  const t8 = titles.find((t) => t.number === 8);
  if (!t8) {
    result.status = "ERROR";
    result.detail = "El JSON de titles no trae Title 8 — schema cambió.";
    return result;
  }
  const upToDate = t8.up_to_date_as_of;
  result.upToDateAsOf = upToDate;

  if (upToDate === fm.edition) {
    result.method = "fecha (up_to_date_as_of == edición embebida)";
    result.detail = `Título 8 vigente al ${upToDate}, igual a la edición embebida.`;
    return result;
  }

  // La fecha del título cambió — intentar el diff de contenido real antes de
  // resolver por fecha sola (el título completo puede haber cambiado en una
  // parte distinta a la nuestra).
  const liveUrl = `https://www.ecfr.gov/api/versioner/v1/full/${upToDate}/title-8.xml?part=214&subpart=C`;
  const live = await fetchSafe(liveUrl);

  if (!live.ok) {
    result.status = "REVISAR";
    result.method = "fecha (proxy — el fetch del XML vigente no respondió, diff de contenido no viable)";
    result.detail = `up_to_date_as_of (${upToDate}) != edición embebida (${fm.edition}). Fetch de contenido respondió ${live.status}.`;
    return result;
  }

  const liveText = stripXml(live.body);
  const ourText = normalizeMd(raw);
  const lenDiffPct = ourText.length ? Math.abs(liveText.length - ourText.length) / ourText.length : 1;

  result.method = "contenido (XML vigente → texto plano vs. markdown embebido → texto plano; comparación de longitud normalizada)";
  if (lenDiffPct > 0.02) {
    result.status = "DRIFT";
    result.detail = `up_to_date_as_of (${upToDate}) != edición embebida (${fm.edition}), Y el texto normalizado difiere ${(lenDiffPct * 100).toFixed(1)}% en longitud — señal de cambio de contenido real en Part 214 Subpart C, no sólo de fecha del título.`;
  } else {
    result.status = "REVISAR";
    result.detail = `up_to_date_as_of (${upToDate}) != edición embebida (${fm.edition}), pero el texto normalizado no difiere significativamente — la enmienda probablemente cayó en otra parte del Título 8, no en Part 214 Subpart C. Confirmar con lectura humana antes de re-capturar (el diff de longitud es aproximado, no carácter-a-carácter).`;
  }
  return result;
}

// ============================================================================
// USC — govinfo (GPO), edición anual oficial
// ============================================================================

const USC_FILES = [
  { label: "8 USC 1101(a)(15)(T) — INA-T", file: "8-usc-1101-a-15-T-nonimmigrant.md" },
  { label: "22 USC 7102 — TVPA", file: "22-usc-7102-tvpa-definitions.md" },
  { label: "8 USC 1324 — SMUG (contraste)", file: "8-usc-1324-bringing-in-harboring.md" },
];

async function checkUSCSection({ label, file }) {
  const path = join(REFS, "statute", file);
  const raw = readFileSync(path, "utf8");
  const fm = frontmatter(raw);
  const result = { piece: label, file: path, declared: fm.edition, status: "OK", method: null, detail: "" };

  if (!fm.source_url) {
    result.status = "ERROR";
    result.detail = "El archivo no declara source_url en su frontmatter — no hay de dónde re-fetchear.";
    return result;
  }

  const live = await fetchSafe(fm.source_url);
  if (!govinfoExists(live)) {
    result.status = "ERROR";
    result.detail = `${fm.source_url} respondió ${live.status}${live.finalUrl !== fm.source_url ? ` (redirigió a ${live.finalUrl})` : ""} — la fuente declarada no respondió como se esperaba. No se inventa un endpoint alternativo; PARAR y reportar (§10.5).`;
    return result;
  }

  // Diff de contenido best-effort: el HTML de govinfo trae navegación/chrome
  // del sitio alrededor del texto de la sección — no es tan limpio como el
  // XML del eCFR. Se aproxima por cobertura de palabras-clave largas (>6
  // caracteres) de nuestro texto dentro del HTML vigente, no por longitud.
  const liveText = stripHtml(live.body).toLowerCase();
  const ourText = normalizeMd(raw);
  const keywords = [...new Set(ourText.toLowerCase().split(" ").filter((w) => w.length > 6))];
  const matched = keywords.filter((w) => liveText.includes(w)).length;
  const coverage = keywords.length ? matched / keywords.length : 1;

  result.method = "contenido (best-effort: cobertura de palabras-clave >6 caracteres de nuestro texto dentro del HTML vigente de govinfo)";
  if (coverage < 0.85) {
    result.status = "DRIFT";
    result.detail = `Sólo ${(coverage * 100).toFixed(0)}% de las palabras-clave de nuestro texto aparecen en el HTML vigente — señal de posible cambio de contenido. Verificación aproximada (HTML con ruido de sitio, no un diff carácter-a-carácter); confirmar con lectura humana antes de re-capturar.`;
  } else {
    result.status = "OK";
    result.detail = `${(coverage * 100).toFixed(0)}% de cobertura de palabras-clave — consistente con contenido sin cambios en la misma edición (${fm.edition}).`;
  }

  // Señal secundaria: ¿existe ya una edición anual más nueva publicada?
  const yearMatch = fm.source_url.match(/USCODE-(\d{4})-/);
  if (yearMatch) {
    const year = Number(yearMatch[1]);
    const nextYear = year + 1;
    const nextUrl = fm.source_url.replaceAll(`USCODE-${year}-`, `USCODE-${nextYear}-`);
    const nextRes = await fetchSafe(nextUrl);
    if (govinfoExists(nextRes)) {
      result.newerEditionAvailable = nextYear;
      if (result.status === "OK") result.status = "REVISAR";
      result.detail += ` Además: existe una edición ${nextYear} publicada en govinfo (nuestra edición embebida es ${year}) — vale re-verificar contra ella.`;
    }
  }

  return result;
}

// ============================================================================
// Main
// ============================================================================

function printRow(r) {
  const icon = { OK: "✓", REVISAR: "⚠", DRIFT: "✗", ERROR: "!" }[r.status];
  console.log(`\n[${icon} ${r.status}] ${r.piece}`);
  console.log(`  declarado: ${r.declared ?? "(sin declarar)"}`);
  if (r.upToDateAsOf) console.log(`  eCFR up_to_date_as_of: ${r.upToDateAsOf}`);
  if (r.newerEditionAvailable) console.log(`  edición más nueva disponible: ${r.newerEditionAvailable}`);
  if (r.method) console.log(`  método: ${r.method}`);
  console.log(`  ${r.detail}`);
}

async function main() {
  console.log(`=== canon-watch — ${new Date().toISOString().slice(0, 10)} ===`);

  const results = [];
  results.push(await checkCFR());
  for (const spec of USC_FILES) results.push(await checkUSCSection(spec));

  for (const r of results) printRow(r);

  console.log("\n--- NO cubierto por este script (ver corpus/MANIFEST.md § \"Vigilancia del canon\") ---");
  console.log("  Policy Manual — sin API pública equivalente. Revisión manual periódica.");
  console.log("  Case-law (federal + AAO) — recomendado: alertas de CourtListener (search/docket alerts).");

  const hardFail = results.filter((r) => r.status !== "OK");
  console.log(`\n=== Resumen: ${results.length - hardFail.length}/${results.length} OK ===`);
  if (hardFail.length) {
    console.log("Piezas que requieren mirada humana:");
    for (const r of hardFail) console.log(`  - [${r.status}] ${r.piece}`);
    console.log("\nQué hacer si hay DRIFT/REVISAR: NO se re-captura automáticamente. Flujo:");
    console.log("  1. Confirmar el cambio contra la fuente oficial (§10.3 — fidelidad verbatim, no inferir).");
    console.log("  2. Re-fetchear la pieza completa (mismo método que el snapshot original).");
    console.log("  3. Gate del director antes de commitear el canon actualizado (§10.1 — cambio sensible).");
    process.exitCode = 1;
  }
}

main();
