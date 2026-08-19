# Skill — invocación de case-law

> **Espejo documental.** Fuente de verdad: `../prompt/reasoning.md §6`. Si divergen, **gana §6**.

## Qué hace

El apéndice de case-law es un **recurso de consulta invocable**, NO una capa que calibre el umbral por
default. Se consulta una decisión **cuando hay una duda de JUICIO en un caso concreto** — típicamente
#F4 "reasonably assessed" (debt bondage), *serious harm*, *abuse of legal process*, labor/services,
compensación.

## La regla (frontera)

Es **jurisprudencia administrativa/federal PERSUASIVA, no vinculante**: informa el juicio del abogado,
no lo reemplaza ni sube/baja un estado por sí sola. Vive en el prompt del specialist, **no** en el 06.
Salvedad de escala de autoridad: los fallos de distrito son persuasivos, no precedente vinculante.

## Fuente en `corpus/`

| Recurso | Ubicación en el paquete |
|---|---|
| Case-law federal/publicada (25 fichas) | `corpus/case-law/federal/` |
| Decisiones AAO de T-visa (10) | `corpus/case-law/aao/` |
| Apéndice del Policy Manual | `corpus/case-law/appendix-pm.md` |

El `retrieval/retrieval-map.md` marca **qué ficha resuelve qué duda** y **cuáles referencia el
apéndice PM** — el mapa determinístico de la consulta.
