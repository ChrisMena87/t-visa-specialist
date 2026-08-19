# `corpus/capture/` — el instrumento de intake

Lo que **captura** los hechos del caso — las dos formas del intake (h-codes / Q-numbers) y su doctrina
en cristiano. Distinto del canon: esto es el **instrumento**, no la fuente legal detrás de él.

**Cómo navegar esto:** el **índice maestro** es
[`../../retrieval/retrieval-map.md`](../../retrieval/retrieval-map.md) §8 — explica las dos formas, su
llave de lectura, y los h-codes que el prompt cita.

| Archivo | Alias | Qué es | Ruteado en el mapa |
|---|---|---|---|
| `modulo-t-preguntas-v0.md` | `MOD-H` | Módulo nuevo — inventario de h-codes (`h1`…`h22`) | §8 ✅ |
| `TEMPLATE INTAKE 6.3.1.md` | `FORM-Q` | Formulario viejo — Q-numbers **por silo** (STT/Labor/DV; los números reinician en cada silo — un `Q8` suelto es ambiguo sin el silo) | §8 ✅ |
| `manual-visa-t-v0.md` | `MAN-INT` | Doctrina para el intaker, en cristiano, por elemento | §8 ✅ |
| `guia-construccion-formulario-v0.md` | *(sin alias)* | Plan de cambios al formulario vivo, dirigido a la jefatura de intake | **NO ruteado** — otro consumidor; no aporta doctrina ni captura al análisis de un caso (`retrieval-map.md` §9) |

**Dos defectos conocidos de este instrumento, documentados (no reparados acá):**
- Los Q-numbers reinician por silo y son ambiguos como llave de ruteo sin el silo — insumo directo de
  por qué un form definitivo necesitaría ID estable por pregunta, no numeración posicional por silo.
- `FORM-Q` tiene un defecto de numeración en el silo STT (dos ítems consecutivos rotulados "7.-") — bug
  del documento fuente, no tocado (`retrieval-map.md` §10 obs.7).
