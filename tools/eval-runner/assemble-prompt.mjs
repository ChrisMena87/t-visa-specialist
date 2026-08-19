#!/usr/bin/env node
// Ensambla el prompt vivo del agente (Artefacto A + Artefacto B) según la regla
// declarada en prompt/assemble.md: título + nota + cuerpo de reasoning
// (sin frontmatter YAML) + separador de línea completa + cuerpo de contract (sin
// frontmatter YAML). Determinístico: mismo input → mismo byte output (sin
// timestamps, sin aleatoriedad) — es la garantía que sostiene el gate de
// regresión "hashes idénticos".
//
// Uso (desde la raíz del repo):
//   node tools/eval-runner/assemble-prompt.mjs [--out <archivo>]
// Sin --out, escribe a stdout. --agent <ruta> es opcional — sólo si corrés el
// script desde otro directorio que no sea la raíz del agente.

import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";

const { values: args } = parseArgs({
  options: {
    agent: { type: "string", default: "." },
    out: { type: "string" },
  },
});

const agentDir = resolve(args.agent);
const configPath = join(agentDir, "config", "agent.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));

const promptCfg = config.prompt;
if (!promptCfg?.reasoning || !promptCfg?.contract) {
  console.error(`config/agent.json de ${args.agent} no declara prompt.reasoning / prompt.contract`);
  process.exit(1);
}

const reasoningPath = join(agentDir, promptCfg.reasoning);
const contractPath = join(agentDir, promptCfg.contract);

// Separa frontmatter YAML (entre las dos primeras líneas "---") del cuerpo.
// El frontmatter es metadata de mantenimiento del artefacto — no va al prompt
// ensamblado (regla explícita de assemble.md).
function stripFrontmatter(raw) {
  if (!raw.startsWith("---")) return raw.trim();
  const closeIdx = raw.indexOf("\n---\n", 4);
  if (closeIdx === -1) return raw.trim();
  return raw.slice(closeIdx + 5).trim();
}

const reasoningBody = stripFrontmatter(readFileSync(reasoningPath, "utf8"));
const contractBody = stripFrontmatter(readFileSync(contractPath, "utf8"));

// Título: "<ID EN MAYÚSCULAS> SPECIALIST — evidence-v1" — la forma exacta que
// usaron las tres corridas manuales del rebuild (it.1/it.2/it.3), sin el sufijo
// de iteración/versión en el título (la versión real va en --prompt-version del
// runner, no en el título del prompt ensamblado).
const idLabel = config.id.replace(/-/g, " ").toUpperCase();
const assembledTitle = `# ${idLabel} SPECIALIST — evidence-v1`;

const SEPARATOR = "=====================================================================";

const assembled = [
  assembledTitle,
  "",
  "(Prompt ensamblado: Artefacto A razonamiento + Artefacto B contrato.)",
  "",
  reasoningBody,
  "",
  "",
  SEPARATOR,
  "",
  "",
  contractBody,
].join("\n");

if (args.out) {
  writeFileSync(args.out, assembled, "utf8");
} else {
  process.stdout.write(assembled);
}
