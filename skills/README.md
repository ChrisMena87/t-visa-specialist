# `skills/` — lo que el agente sabe hacer

Vista desglosada de las capacidades que hoy viven **inline en el prompt**. Cada skill lleva su
instrucción + su puntero a `corpus/`.

**Decisión de diseño (gate del director):** `skills/` es **espejo documental del prompt** — una sola
fuente de verdad (el prompt es el ensamble; esto lo desglosa para auditarlo). Convertir el prompt en
consumidor real de `skills/` (referencia en vez de espejo) es **candidato futuro registrado**, no se
hace ahora.

**Cómo navegar esto:** el **índice maestro** de qué archivo de `corpus/` resuelve cada duda es
[`../retrieval/retrieval-map.md`](../retrieval/retrieval-map.md) — las skills no duplican ese ruteo,
apuntan a él.

| Archivo | Qué es | Fuente literal |
|---|---|---|
| `rescreening-banks.md` | Los 6 bancos de rescreening + la distinción gap ejecución vs diseño. | `../prompt/reasoning.md §4` (`RSN`) — **no** `corpus/capture/` |
| `case-law-invocation.md` | Cuándo y cómo invocar case-law (recurso persuasivo, no calibra umbral). | `corpus/case-law/` |
| `read-intake-forms.md` | Lectura de las dos formas de intake (h-codes / Q-numbers). | `corpus/capture/` |
