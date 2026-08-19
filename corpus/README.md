# `corpus/` — el canon legal embebido

El canon completo del alivio T, **copiado dentro del paquete** (snapshot), organizado por su taxonomía.
`MANIFEST.md` registra la procedencia de cada pieza (de qué versión del canon-firma salió, fecha de
snapshot) y la **regla de sync** — el drift silencioso queda prohibido por diseño.

**Cómo navegar esto:** cada subcarpeta tiene su propio README (qué hay, una línea por archivo, qué NO se
rutea y por qué). El **índice maestro** — qué archivo exacto resuelve cada duda de juicio, en qué orden
de autoridad — es [`../retrieval/retrieval-map.md`](../retrieval/retrieval-map.md). No se navega este
corpus por carpeta suelta: se navega por disparador, vía el mapa.

| Sub-carpeta | Contenido |
|---|---|
| `doctrine/` | El "06" (evaluation framework) + matrices de extracción TVPA (3 piezas). |
| `capture/` | Módulo de preguntas + manual + guía de construcción del formulario (4 piezas). |
| `manual/` | Policy Manual: victims-of-trafficking + adjustment + waivers + extreme-hardship (4 piezas). |
| `case-law/federal/` | 25 fichas federales/publicadas. |
| `case-law/aao/` | 10 decisiones AAO + metadata (_index/_schema/_template/README). |
| `case-law/appendix-pm.md` | El apéndice de case-law del Policy Manual. |
| `references/statute/` | 8 USC 1101(a)(15)(T) · 22 USC 7102 · 8 USC 1324. |
| `references/regulations/` | 8 CFR 214 subpart C · T-Visa Final Rule. |
| `MANIFEST.md` | 56 piezas con procedencia (origen + SHA + fecha) + regla de sync + vigilancia del canon. |

**Mecanismo:** copia-snapshot — el repositorio de origen del proyecto conserva su propio canon vivo;
este corpus es una copia con cordón umbilical trazable vía `MANIFEST.md`.

**Regla de sync (resumen):** doctrina nueva firmada que toque una pieza → **re-empaque del agente**
(nuevo snapshot + bump de `config/agent.json`). El corpus embebido conserva cordón umbilical trazable
al repositorio de origen.
