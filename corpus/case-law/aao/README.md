# AAO T-Visa Decisions — Corpus de decisiones no-precedente

Decisiones no-precedente de la Oficina de Apelaciones Administrativas
(AAO) en casos de T-Visa, curadas como referencia doctrinal para el
prompt del agente (`prompt/`) y como material para un futuro retriever
si el paquete adopta RAG.

**Cómo navegar esto:** el **índice maestro** es
[`../../retrieval/retrieval-map.md`](../../retrieval/retrieval-map.md) — su §7 dice, para cada patrón
de hecho, **qué decisión AAO** lo resuelve. El primer salto obligatorio del mapa es siempre `_index.md`
(el índice de ruteo del corpus, con la tabla maestra fecha/ID/outcome/pattern y la doctrina destilada
acumulada cross-case).

## Por qué este corpus

Las decisiones AAO son **no-precedente** (no obligan a USCIS en futuros
casos) pero son la mejor evidencia pública de cómo el adjudicador ve los
patrones de hecho. Esto importa por dos razones operativas:

1. **0% sustained directo en 2024.** El AAO no aprueba T directamente en
   apelación; la victoria máxima es el remand. Eso significa que el
   patrón de fact-finding que el AAO acepta o rechaza es lo que decide
   el caso al volver al centro de servicio. Un specialist que conoce
   esos patrones produce análisis que el closer puede usar para evitar
   denegaciones en primera instancia.

2. **Los criterios de "forma severa de trata" se aclaran en la fricción.**
   El statute (`22 USC 7102(11)`) es deliberadamente amplio; la AAO
   muestra qué configuraciones de hecho USCIS acepta como cumpliendo
   acto/medios/fin y cuáles no. Tener un corpus revisado de esas
   decisiones permite calibrar los semáforos (✅/⚠️/❌/🚫) del skill con
   más precisión que la lectura del statute solo.

Los criterios destilados de este corpus aterrizan en el prompt del
specialist como **patrones**, no como citas (ver regla 7 del v3.4 —
confidencialidad inter-caso; los nombres no salen al output). La cita
del caso vive aquí; el patrón vive en el prompt.

## Estructura de archivos

```
aao-t-visa-decisions/
├── README.md                          ← este archivo
├── _schema.md                         ← spec de frontmatter por caso
├── _template.md                       ← plantilla para clonar al crear caso nuevo
├── _index.md                          ← índice ordenado de casos (se actualiza al agregar)
├── in-re-{case_id}-{YYYY-MM-DD}.md    ← un archivo por decisión
└── parsed/                            ← (opcional) markdown crudo de LlamaParse antes de curar
    └── in-re-{case_id}-raw.md
```

## Convenciones

### Naming

Archivo del caso: `in-re-{case_id}-{YYYY-MM-DD}.md`

- `case_id`: número del caso tal como aparece en la decisión, sin
  prefijo "In Re:" ni guiones. Ejemplo: `23981595`.
- `YYYY-MM-DD`: fecha de la decisión.

Ejemplo: `in-re-23981595-2023-01-26.md`.

### Frontmatter

Ver `_schema.md` para la spec completa. Cada caso lleva:

- Identidad (case_id, fecha, link a PDF original si está)
- Outcome canónico (`dismissed` | `remanded` | `sustained`)
- Issues primarios (vocabulario controlado — ver `_schema.md`)
- Holding bullets (1-4)
- Citaciones del propio caso al statute/CFR/Policy Manual
- Relevancia al skill (qué regla/sección del prompt anchorea)
- Source (parsed_from, parsed_with, parse_date)

### Body del archivo

Markdown narrativo organizado en tres secciones:

1. **Hechos relevantes** — qué pasó al peticionario, en orden cronológico
   y despersonalizado donde corresponda (el caso AAO ya es público, pero
   mantenemos la voz analítica).
2. **Razonamiento del AAO** — qué argumentos usó el adjudicador para
   sostener o revocar la denegación.
3. **Doctrina destilada** — qué se aprende sobre el patrón de hecho para
   futuros casos. Esta sección es la que potencialmente alimenta el
   prompt del skill.

Mantener el body bajo 1500 palabras por caso. Para detalles más extensos,
referenciar la fuente original en el frontmatter.

## Cómo el skill usa este corpus

**Estado actual (sin RAG):** referencia humana durante iteración del
prompt. Si una regla del v3.X cita un patrón ("smuggling con labor
durante retención"), el patrón está respaldado por uno o más casos
documentados aquí. El skill no lee este corpus en runtime — los humanos
sí, al diseñar reglas.

**Estado futuro (con RAG, post-ADR-024):** chunks de este corpus entran
al retriever del specialist. Cuando el specialist analiza un intake con
un patrón parecido a uno de los casos, el retriever surface ese caso en
el contexto, y el specialist puede citar la doctrina (pero sigue
respetando la regla 7 — el caso se cita como "AAO non-precedent
2023-01-26" o similar, no por nombre del peticionario).

Hasta que el RAG aterrice, **el flujo de incorporación de doctrina al
skill es manual:**

1. LlamaParse extrae el PDF a markdown.
2. Curador (fundador o paralegal designado) crea archivo aquí con
   frontmatter + body.
3. Si el patrón documentado motiva un cambio al prompt, se incorpora en
   la siguiente versión del specialist con cita al `case_id` en el
   changelog (NO en el body del prompt).

## Cómo empezar a poblar

Cuando llega un parseo nuevo de LlamaParse:

1. Clonar `_template.md` con el naming convention.
2. Llenar frontmatter desde la primera página del parseo (case ID, fecha,
   outcome).
3. Resumir hechos + razonamiento del AAO en el body.
4. Destilar 1-3 bullets de doctrina aplicable al skill.
5. Si el parseo crudo tiene valor archival, guardarlo en
   `parsed/in-re-{case_id}-raw.md`.
6. Actualizar `_index.md` con la nueva entrada.

## Vocabulario controlado para `primary_issue`

Para mantener consistencia entre casos, el campo `primary_issue` del
frontmatter usa este vocabulario (extensible — agregar nuevos términos
acá y en `_schema.md`):

- `smuggling-to-trafficking-transition` — caso donde inicio voluntario
  de smuggling deriva en trata por cambio de condiciones.
- `involuntary-servitude-via-threats` — labor forzada bajo amenazas
  serias (muerte, daño a familia, etc.).
- `debt-bondage` — labor compulsada para pagar deuda.
- `sex-trafficking-vs-dv` — diferenciación entre trata sexual y DV pura.
- `sex-trafficking-commercial-acts` — requisito de actos sexuales
  comerciales (no solo acoso).
- `mental-health-credibility` — credibilidad afectada por TEPT u otra
  condición mental.
- `physical-presence-continuing-victimization` — presencia satisfecha
  por victimización continua o amenazas posteriores.
- `physical-presence-temporal-nexus` — nexo temporal entre trata y
  presencia actual.
- `inadmissibility-connection` — conexión entre presencia
  indocumentada/entrada sin inspección y la trata.
- `cooperation-with-le` — cooperación con autoridades o excepción
  (menor / trauma).
- `bona-fide-determination` — relacionado a la Regla Final de Abril 2024
  (BFD process).
- `adjustment-of-status` — relacionado a I-485 post-T.

## Status del corpus

- **Casos documentados:** 10/10 — completo (2026-08-19; la cola original de este
  README —23981595 y 22819771— ya está curada, junto con las otras 8).

## Qué hay acá (una línea por archivo)

| Archivo | Qué resuelve |
|---|---|
| `_index.md` | Índice de ruteo — primer salto obligatorio (tabla maestra + doctrina destilada cross-case) |
| `_schema.md` | Spec del frontmatter (incluye la nota de `nivel_autoridad`, ver ↓) |
| `_template.md` | Plantilla para clonar al curar un caso nuevo |
| `in-re-5845586-2020-04-24.md` | Vivienda-por-sexo de no-pareja; DV y trata coexisten |
| `in-re-7360790-2021-08-12.md` | Sexo extorsionado por coyote a cambio de continuar el traslado |
| `in-re-10106816-2021-10-22.md` | Hardship falla — lazos sociales / tratamiento disponible |
| `in-re-10892507-2021-12-08.md` | Coerción sexual sin quid-pro-quo articulado → acoso, no trata |
| `in-re-11297648-2021-07-02.md` | Trata aceptada, hardship dispositivamente insuficiente |
| `in-re-13039037-2021-08-23.md` | "Deuda" sin detalle económico probatorio — contra-ejemplo de debt bondage |
| `in-re-17756724-2021-11-18.md` | PTSD + contacto continuado del traficante sostienen nexo de presencia |
| `in-re-22819771-2023-08-15.md` | Retorno temporal y reingreso — continued victimization |
| `in-re-23981595-2023-01-26.md` | Smuggling voluntario deviene trata — propósito separado |
| `in-re-35887018-2025-02-26.md` | "Singled out" del grupo — labor que excede el arreglo |

## Sobre el campo `nivel_autoridad`

Las 10 decisiones son **Nivel 7** (no-precedente, persuasivo) en una escala estructural de la base de
conocimiento de origen del proyecto (fuera de este paquete). Ese número **no gobierna** el orden de
consulta de este agente: el Policy Manual va por encima del case-law en `retrieval-map.md` §2 (el
agente evalúa cómo adjudicaría USCIS; los casos persuaden, no mandan — ver `PHILOSOPHY.md` §6). No se
redefinió `nivel_autoridad` en `_schema.md` — es un campo de un esquema compartido con otros alivios;
cambiar su escala acá excedería este paquete. Mismo tratamiento que `case-law/federal/README.md` — ver
ahí el detalle completo.
