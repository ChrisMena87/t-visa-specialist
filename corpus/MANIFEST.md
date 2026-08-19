---
documento: "corpus/MANIFEST.md — T-Visa specialist"
fecha: 2026-08-19
estado: "56 piezas legales embebidas (25 case-law federal + 14 AAO incl. metadata + 1 apéndice PM + 3 doctrine + 4 capture + 4 manual + 5 references). Snapshot desde el repositorio de origen del proyecto."
---

# MANIFEST de procedencia — corpus legal embebido

Este archivo es el **cordón umbilical trazable** entre el corpus embebido en este paquete y su fuente
oficial. El corpus vive **dentro** del agente por diseño — universo autocontenido — pero embebido **no**
significa huérfano: cada pieza registra de qué versión salió y cuándo, para que un drift entre el
paquete y la fuente sea **visible por diseño**, nunca silencioso.

## Regla de sync

**Doctrina nueva firmada que toque una pieza de este corpus → re-empaque del agente.** Esto significa:
nuevo snapshot de la(s) pieza(s) afectada(s) + bump de la fecha de snapshot en la fila correspondiente +
bump de `prompt_version` en `config/agent.json` si la doctrina afecta el razonamiento. El drift
silencioso —el paquete quedando desactualizado sin que nadie lo note— queda prohibido por diseño: este
MANIFEST es la superficie donde ese drift se vuelve visible.

## Tabla de procedencia

| Pieza en el paquete | Origen (repo de origen) | Commit SHA (snapshot) | Fecha de snapshot |
|---|---|---|---|
| `corpus/doctrine/06-evaluation-framework-v0.1.md` | `legal-knowledge-base/canons/visa-t/03-doctrina/06-evaluation-framework-v0.1.md` | a28978f708c5 | 2026-08-19 |
| `corpus/doctrine/04-tvpa-element-matrix-v1.md` | `legal-knowledge-base/canons/visa-t/02-extraccion/04-tvpa-element-matrix-v1.md` | a28978f708c5 | 2026-08-19 |
| `corpus/doctrine/05-eligibility-extra-elements-v1.md` | `legal-knowledge-base/canons/visa-t/02-extraccion/05-eligibility-extra-elements-v1.md` | a28978f708c5 | 2026-08-19 |
| `corpus/capture/modulo-t-preguntas-v0.md` | `legal-knowledge-base/canons/visa-t/05-intake/modulo-t-preguntas-v0.md` | a28978f708c5 | 2026-08-19 |
| `corpus/capture/manual-visa-t-v0.md` | `legal-knowledge-base/canons/visa-t/05-intake/manual-visa-t-v0.md` | a28978f708c5 | 2026-08-19 |
| `corpus/capture/guia-construccion-formulario-v0.md` | `legal-knowledge-base/canons/visa-t/05-intake/guia-construccion-formulario-v0.md` | a28978f708c5 | 2026-08-19 |
| `corpus/capture/TEMPLATE INTAKE 6.3.1.md` | `legal-knowledge-base/canons/visa-t/05-intake/TEMPLATE INTAKE 6.3.1.md` | a28978f708c5 | 2026-08-19 |
| `corpus/manual/part-b-victims-of-trafficking.md` | `legal-knowledge-base/sources/policy-manual/vol-3-humanitarian-protection-and-parole/part-b-victims-of-trafficking.md` | a28978f708c5 | 2026-08-19 |
| `corpus/manual/part-j-trafficking-victim-based-adjustment.md` | `legal-knowledge-base/sources/policy-manual/vol-7-adjustment-of-status/part-j-trafficking-victim-based-adjustment.md` | a28978f708c5 | 2026-08-19 |
| `corpus/manual/part-o-victims-of-trafficking.md` | `legal-knowledge-base/sources/policy-manual/vol-9-waivers-and-other-forms-of-relief/part-o-victims-of-trafficking.md` | a28978f708c5 | 2026-08-19 |
| `corpus/manual/part-b-extreme-hardship.md` | `legal-knowledge-base/sources/policy-manual/vol-9-waivers-and-other-forms-of-relief/part-b-extreme-hardship.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/appendix-pm.md` | `legal-knowledge-base/sources/policy-manual/vol-3-humanitarian-protection-and-parole/part-b-appendix-case-law-t-visa.md` | a28978f708c5 | 2026-08-19 |
| `corpus/references/statute/8-usc-1101-a-15-T-nonimmigrant.md` | `legal-knowledge-base/sources/statute/8-usc-1101-a-15-T-nonimmigrant.md` | a28978f708c5 | 2026-08-19 |
| `corpus/references/statute/22-usc-7102-tvpa-definitions.md` | `legal-knowledge-base/sources/statute/22-usc-7102-tvpa-definitions.md` | a28978f708c5 | 2026-08-19 |
| `corpus/references/statute/8-usc-1324-bringing-in-harboring.md` | `legal-knowledge-base/sources/statute/8-usc-1324-bringing-in-harboring.md` | a28978f708c5 | 2026-08-19 |
| `corpus/references/regulations/8-cfr-214-subpart-c-t-nonimmigrant-status.md` | `legal-knowledge-base/sources/regulations/cfr/8-cfr-214-subpart-c-t-nonimmigrant-status.md` | a28978f708c5 | 2026-08-19 |
| `corpus/references/regulations/T-Visa Final Rule.md` | `legal-knowledge-base/sources/regulations/federal-register/T-Visa Final Rule.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/bailey-v-alabama-scotus-1911.md` | `legal-knowledge-base/sources/case-law/bailey-v-alabama-scotus-1911.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/clyatt-v-united-states-scotus-1905.md` | `legal-knowledge-base/sources/case-law/clyatt-v-united-states-scotus-1905.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/elat-v-ngoubene-dmd-2014.md` | `legal-knowledge-base/sources/case-law/elat-v-ngoubene-dmd-2014.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/fatty-v-nielsen-wdwash-2018.md` | `legal-knowledge-base/sources/case-law/fatty-v-nielsen-wdwash-2018.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/matter-of-chawathe-aao-2010.md` | `legal-knowledge-base/sources/case-law/matter-of-chawathe-aao-2010.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/matter-of-christos-inc-aao-2015.md` | `legal-knowledge-base/sources/case-law/matter-of-christos-inc-aao-2015.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/matter-of-obaigbena-bia-1988.md` | `legal-knowledge-base/sources/case-law/matter-of-obaigbena-bia-1988.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/matter-of-yajure-hurtado-bia-2025.md` | `legal-knowledge-base/sources/case-law/matter-of-yajure-hurtado-bia-2025.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/medina-tovar-v-zuchowski-9th-cir-2020.md` | `legal-knowledge-base/sources/case-law/medina-tovar-v-zuchowski-9th-cir-2020.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/nunag-tanedo-v-east-baton-rouge-cdcal-2011.md` | `legal-knowledge-base/sources/case-law/nunag-tanedo-v-east-baton-rouge-cdcal-2011.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/pollock-v-williams-scotus-1944.md` | `legal-knowledge-base/sources/case-law/pollock-v-williams-scotus-1944.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/ruiz-v-fernandez-edwash-2013.md` | `legal-knowledge-base/sources/case-law/ruiz-v-fernandez-edwash-2013.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/united-states-v-bradley-1st-cir-2004.md` | `legal-knowledge-base/sources/case-law/united-states-v-bradley-1st-cir-2004.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/united-states-v-calimlim-7th-cir-2008.md` | `legal-knowledge-base/sources/case-law/united-states-v-calimlim-7th-cir-2008.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/united-states-v-dann-9th-cir-2011.md` | `legal-knowledge-base/sources/case-law/united-states-v-dann-9th-cir-2011.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/united-states-v-djoumessi-6th-cir-2008.md` | `legal-knowledge-base/sources/case-law/united-states-v-djoumessi-6th-cir-2008.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/united-states-v-farrell-8th-cir-2009.md` | `legal-knowledge-base/sources/case-law/united-states-v-farrell-8th-cir-2009.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/united-states-v-kaufman-10th-cir-2008.md` | `legal-knowledge-base/sources/case-law/united-states-v-kaufman-10th-cir-2008.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/united-states-v-kozminski-scotus-1988.md` | `legal-knowledge-base/sources/case-law/united-states-v-kozminski-scotus-1988.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/united-states-v-marcus-edny-2007.md` | `legal-knowledge-base/sources/case-law/united-states-v-marcus-edny-2007.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/united-states-v-pipkins-11th-cir-2004.md` | `legal-knowledge-base/sources/case-law/united-states-v-pipkins-11th-cir-2004.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/united-states-v-reynolds-scotus-1914.md` | `legal-knowledge-base/sources/case-law/united-states-v-reynolds-scotus-1914.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/united-states-v-udeozor-4th-cir-2008.md` | `legal-knowledge-base/sources/case-law/united-states-v-udeozor-4th-cir-2008.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/united-states-v-veerapol-9th-cir-2002.md` | `legal-knowledge-base/sources/case-law/united-states-v-veerapol-9th-cir-2002.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/federal/united-states-v-warren-11th-cir-1985.md` | `legal-knowledge-base/sources/case-law/united-states-v-warren-11th-cir-1985.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/aao/README.md` | `legal-knowledge-base/canons/visa-t/case-law/aao-t-visa-decisions/README.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/aao/_index.md` | `legal-knowledge-base/canons/visa-t/case-law/aao-t-visa-decisions/_index.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/aao/_schema.md` | `legal-knowledge-base/canons/visa-t/case-law/aao-t-visa-decisions/_schema.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/aao/_template.md` | `legal-knowledge-base/canons/visa-t/case-law/aao-t-visa-decisions/_template.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/aao/in-re-10106816-2021-10-22.md` | `legal-knowledge-base/canons/visa-t/case-law/aao-t-visa-decisions/in-re-10106816-2021-10-22.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/aao/in-re-10892507-2021-12-08.md` | `legal-knowledge-base/canons/visa-t/case-law/aao-t-visa-decisions/in-re-10892507-2021-12-08.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/aao/in-re-11297648-2021-07-02.md` | `legal-knowledge-base/canons/visa-t/case-law/aao-t-visa-decisions/in-re-11297648-2021-07-02.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/aao/in-re-13039037-2021-08-23.md` | `legal-knowledge-base/canons/visa-t/case-law/aao-t-visa-decisions/in-re-13039037-2021-08-23.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/aao/in-re-17756724-2021-11-18.md` | `legal-knowledge-base/canons/visa-t/case-law/aao-t-visa-decisions/in-re-17756724-2021-11-18.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/aao/in-re-22819771-2023-08-15.md` | `legal-knowledge-base/canons/visa-t/case-law/aao-t-visa-decisions/in-re-22819771-2023-08-15.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/aao/in-re-23981595-2023-01-26.md` | `legal-knowledge-base/canons/visa-t/case-law/aao-t-visa-decisions/in-re-23981595-2023-01-26.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/aao/in-re-35887018-2025-02-26.md` | `legal-knowledge-base/canons/visa-t/case-law/aao-t-visa-decisions/in-re-35887018-2025-02-26.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/aao/in-re-5845586-2020-04-24.md` | `legal-knowledge-base/canons/visa-t/case-law/aao-t-visa-decisions/in-re-5845586-2020-04-24.md` | a28978f708c5 | 2026-08-19 |
| `corpus/case-law/aao/in-re-7360790-2021-08-12.md` | `legal-knowledge-base/canons/visa-t/case-law/aao-t-visa-decisions/in-re-7360790-2021-08-12.md` | a28978f708c5 | 2026-08-19 |

**El material de casos y su historial de auditoría permanecen en el repositorio privado de origen.**

---

## Vigilancia del canon (herramienta: `tools/canon-watch/`)

Cómo se detecta que una pieza de este corpus quedó desactualizada respecto de su fuente — por capa,
según si hay o no una API oficial que lo permita automatizar.

### Automatizado — `canon:check` (statute + regulations)

`tools/canon-watch/check-canon-freshness.mjs` (`node tools/canon-watch/check-canon-freshness.mjs`)
compara las piezas de `references/statute/` y `references/regulations/8-cfr-214-...` contra sus fuentes
oficiales:

- **CFR** — eCFR versioner API (`/api/versioner/v1/full/{fecha}/title-8.xml?part=214&subpart=C`).
  Compara la fecha vigente del título contra la edición embebida; si difieren, intenta además un diff de
  contenido normalizado (XML→texto vs. markdown→texto) antes de resolver por fecha sola — declara
  siempre qué método usó. Distingue **REVISAR** (la fecha del título se movió pero el contenido de
  nuestra Subpart no cambió — probablemente cambió otra parte del título) de **DRIFT** (el contenido de
  nuestra pieza sí cambió).
- **USC** — govinfo.gov (GPO), re-fetch de la misma `source_url` declarada en cada archivo; diff
  best-effort por cobertura de palabras-clave (el HTML de govinfo trae ruido de sitio, no es tan limpio
  como el XML del eCFR) + chequeo de si ya existe una edición anual más nueva publicada.

**El script REPORTA, nunca actualiza.** Exit code ≠ 0 si hay algo que mirar (para correr en cron). La
actualización real del canon sigue siendo manual: confirmar el cambio contra la fuente oficial, re-
fetchear la pieza completa, y una revisión humana antes de comitear el canon actualizado.

**Candidato a cron nocturno/semanal.**

### Manual — Policy Manual

El Policy Manual **no tiene una API pública de versionado** equivalente al eCFR. USCIS publica updates
por Chapter/Part sin un feed estructurado consultable programáticamente. **Recomendación:** revisión
manual periódica de las Parts citadas en este MANIFEST (`corpus/manual/`) contra la versión publicada en
uscis.gov — no hay atajo automatizable hoy.

### Manual, pero con una palanca real — case-law (alertas de CourtListener)

El case-law no "se actualiza" como el CFR/USC (una decisión ya emitida no cambia), pero el **frente vivo**
sí puede moverse: una decisión citada puede ser apelada, superada legislativamente (como ya le pasó a
Kozminski — ver `retrieval-map.md` §6.1), o revisitada por un circuito. **Recomendación:** configurar
**alertas de CourtListener** — *search alerts* sobre los frentes doctrinales vivos de este corpus (ej.
"abuse of legal process" + T-visa; "debt bondage" 8th/9th Circuit) y *docket alerts* sobre los casos ya
citados que todavía tengan apelación pendiente o historia procesal abierta (ej. las fichas marcadas con
caveat de historia posterior en `retrieval-map.md` §6.1). Estas alertas llegan por email cuando
CourtListener indexa un desarrollo nuevo — es la única señal de "esto se movió" que no requiere
re-consultar todo el corpus a mano periódicamente. No está configurado por defecto; es una recomendación
operativa, no una herramienta empaquetada.
