# `config/` — versión viva, modelo, parámetros

Fuente única de la configuración del agente.

| Archivo | Qué es |
|---|---|
| `agent.json` | `{ id, relief, prompt_version, model, params }`. Versión viva = `evidence-v1.2`. |

Precedencia de proveedor / overrides de modelo: las env vars (`AI_PROVIDER`, `ANTHROPIC_MODEL`, etc.)
sobreescriben los defaults que declara `agent.json`.
