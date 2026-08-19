# `case-law/federal/` — 25 fichas de jurisprudencia federal/publicada

Case-law **persuasivo**, no vinculante — informa el juicio del abogado, no lo reemplaza ni sube/baja
un estado por sí solo (skill `../../skills/case-law-invocation.md`).

**Cómo navegar esto:** no lo leas archivo por archivo. El **índice maestro** es
[`../../retrieval/retrieval-map.md`](../../retrieval/retrieval-map.md) — su §6 dice, para cada duda de
juicio, **qué ficha** la resuelve y **por qué**. Esta carpeta es el destino final de esas rutas, no el
punto de partida.

## Qué hay acá — dos orígenes distintos

- **19 fichas del apéndice PM** — las cita el *Appendix: Case Law References for T Visa Adjudications*
  (`corpus/case-law/appendix-pm.md`, 3 USCIS-PM B). Cada una lleva `pm_appendix_concepts:` en su
  frontmatter. Agrupadas por concepto en `retrieval-map.md` §6.1.
- **6 fichas de extensión del proyecto** — no están en el apéndice; las agregó la KB de la firma como
  herramientas evidenciarias/procesales (estándar de prueba, revisión de novo, aseveraciones del abogado
  no son evidencia, detención mandatoria, momento del vínculo derivativo, jurisdicción de habeas). Su
  frontmatter declara la procedencia con la fórmula *"Caso del frente de los 7 del README... NO del
  apéndice del PM"*. Ver `retrieval-map.md` §6.2.

| Archivo | Qué resuelve (una línea) |
|---|---|
| `bailey-v-alabama-scotus-1911.md` | Peonage — distinción con contrato voluntario |
| `clyatt-v-united-states-scotus-1905.md` | Peonage — definición base |
| `elat-v-ngoubene-dmd-2014.md` | Abuse of legal process — amenaza migratoria como coerción |
| `fatty-v-nielsen-wdwash-2018.md` | *(extensión)* Jurisdicción de habeas / stay de remoción durante adjudicación T |
| `matter-of-chawathe-aao-2010.md` | *(extensión)* Estándar de prueba — preponderancia, no burden of proof |
| `matter-of-christos-inc-aao-2015.md` | *(extensión)* AAO revisa de novo en apelación |
| `matter-of-obaigbena-bia-1988.md` | *(extensión)* Aseveraciones del abogado no son evidencia |
| `matter-of-yajure-hurtado-bia-2025.md` | *(extensión)* Detención mandatoria / sin fianza para EWI |
| `medina-tovar-v-zuchowski-9th-cir-2020.md` | *(extensión)* Momento del vínculo del cónyuge derivativo (al otorgamiento) |
| `nunag-tanedo-v-east-baton-rouge-cdcal-2011.md` | Abuse of legal process |
| `pollock-v-williams-scotus-1944.md` | Peonage |
| `ruiz-v-fernandez-edwash-2013.md` | Abuse of legal process |
| `united-states-v-bradley-1st-cir-2004.md` | Compensación no descarta labor forzada |
| `united-states-v-calimlim-7th-cir-2008.md` | Abuse of legal process — pasaporte + advertencias vagas |
| `united-states-v-dann-9th-cir-2011.md` | Threats of harm — vantage point de la víctima |
| `united-states-v-djoumessi-6th-cir-2008.md` | Threats of harm + abuse of legal process + duración breve |
| `united-states-v-farrell-8th-cir-2009.md` | Multi-concepto: threats + abuse of legal process + debt bondage |
| `united-states-v-kaufman-10th-cir-2008.md` | Non-traditional types of work |
| `united-states-v-kozminski-scotus-1988.md` | Abuse of legal process (superación legislativa parcial — ver caveat) |
| `united-states-v-marcus-edny-2007.md` | Non-traditional types of work |
| `united-states-v-pipkins-11th-cir-2004.md` | Duration of victimization — basta una porción involuntaria |
| `united-states-v-reynolds-scotus-1914.md` | Peonage |
| `united-states-v-udeozor-4th-cir-2008.md` | Threats of harm |
| `united-states-v-veerapol-9th-cir-2002.md` | Abuse of legal process |
| `united-states-v-warren-11th-cir-1985.md` | Threats of harm |

**Caveats por ficha** (typos del apéndice, historia procesal posterior, colisiones de cita) — ver
`retrieval-map.md` §6.1, tabla de caveats. No se repiten acá para no duplicar.

## Sobre el campo `nivel_autoridad`

Cada ficha declara `nivel_autoridad: 4` en su frontmatter — es un **nivel estructural** de la base de
conocimiento de origen del proyecto (fuera de este paquete: describe toda la base de conocimiento, no
sólo T-Visa). Ese campo es **plano**: SCOTUS (Bailey, Clyatt, Pollock, Reynolds, Kozminski) comparte el
mismo `4` que una orden de distrito no publicada (Fatty) — no distingue vinculante de persuasivo.

**Este campo NO gobierna el orden de consulta de este agente.** Ese orden lo fija `retrieval-map.md`
§2: el **Policy Manual va por encima del case-law**, porque el agente evalúa cómo adjudicaría USCIS, y
los casos persuaden, no mandan (ver `PHILOSOPHY.md` §6 para el porqué). No se reescribió
`nivel_autoridad` en ninguna ficha para reflejar esto — es un campo de un esquema compartido por otros
alivios, y redefinir su escala acá excedería este paquete. Cualquiera que navegue por este campo debe
saber que el ruteo real de este agente vive en `retrieval-map.md` §2, no en el número de la ficha.
