---
case_id: ""
case_full_id: "In Re: "
decision_date: YYYY-MM-DD
relief: t-visa
outcome: ""                  # dismissed | remanded | sustained
primary_issue:
  - ""                       # ver vocabulario controlado en README.md

holding_summary: |
  [Una oración resumen del holding central]

holding_bullets:
  - "[Primera proposición doctrinal]"
  - "[Segunda — opcional]"
  - "[Tercera — opcional, max 4]"

statute_cites:
  - ""
cfr_cites:
  - ""
policy_manual_cites:
  - ""                       # ej. "3 USCIS-PM B.2" si la decisión lo cita

skill_relevance:
  rules_anchored:
    - ""                     # ej. "v3.4 §Falsos positivos — sub-pattern smuggling..."
  prompt_pattern_label: ""   # nombre genérico del patrón (sin nombre de caso)
  veredict_implication: |
    [Cómo este caso debería afectar el veredicto del skill en
    intakes con patrón similar]

source:
  parsed_from: ""            # nombre del PDF original
  parsed_with: llamaparse    # llamaparse | manual | claude-vision
  parse_date: YYYY-MM-DD
  uscis_url: ""              # opcional
  parsed_md_path: ""         # opcional, ej. "parsed/in-re-{id}-raw.md"

status: raw                  # raw | curated | reviewed
curated_by: ""
review_notes: ""
---

## Hechos relevantes

[Resumen narrativo cronológico de qué pasó al peticionario. ~150-300
palabras. Voz analítica; despersonalizar donde se pueda.]

## Razonamiento del AAO

[Qué argumentos usó el adjudicador para sostener o revocar la denegación.
~200-400 palabras. Notar explícitamente qué statute/CFR/Policy Manual
citó la AAO y cómo lo interpretó.]

## Doctrina destilada

[1-3 bullets sintetizando la lección para el skill. Cada bullet
estructurado como:
- **Patrón:** descripción genérica del fact pattern
- **Consecuencia para T:** cómo cambia el análisis
- **Aterriza en:** qué regla o sección del prompt del specialist]

## Cita textual relevante

[Opcional — si hay un párrafo de la decisión que captura la doctrina
con precisión, citarlo entre blockquote con número de página del PDF
original.]

> [Cita textual]
> — *In Re: [case_id], p. [N]*
