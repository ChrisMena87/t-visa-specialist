# T-Visa Specialist

> [!CAUTION]
> # ⚠️ EXPERIMENTAL LABORATORY — NOT FOR PRODUCTION USE
> # ⚠️ LABORATORIO EXPERIMENTAL — NO USAR EN PRODUCCIÓN
>
> ### **This software is not a substitute for the advice of an attorney.**
> ### **Este software no sustituye el consejo de un abogado.**
>
> - **Not in production.** This system has never been used to evaluate any client's case.
>   **No legal or commercial decision has ever been made based on this tool.**
> - **No está en producción.** Este sistema no se ha utilizado para evaluar ningún caso de ningún
>   cliente. **Ninguna decisión legal ni comercial se ha tomado a partir de esta herramienta.**
> - **It does not replace human judgment — by design.** Its outputs are never eligibility
>   determinations: they organize evidence for licensed professionals, who make every decision.
> - **No reemplaza el juicio humano — por diseño.** Sus salidas nunca son determinaciones de
>   elegibilidad: organizan evidencia para profesionales con licencia, que toman todas las decisiones.
> - **The embedded legal corpus is a dated snapshot** (see [`corpus/MANIFEST.md`](./corpus/MANIFEST.md)).
>   The law changes — always verify against primary sources.
>   **El corpus legal es un snapshot con fecha.** La ley cambia — verifica siempre contra fuente primaria.
>
> **Intended use / Uso previsto:** research, evaluation, and operation under the supervision of
> licensed attorneys. Any other use is outside the design and the intent of this project. /
> Investigación, evaluación y operación bajo supervisión de abogados con licencia. Cualquier otro
> uso queda fuera del diseño y de la intención de este proyecto.

Un agente de análisis para T-Visa (`8 USC 1101(a)(15)(T)`) — evalúa evidencia de un intake contra el
canon legal y reporta qué elementos captura y en qué estado. Se entrega como paquete standalone: prompt,
corpus legal embebido con procedencia trazable, un mapa de retrieval determinístico, y el runner que lo
evalúa.

## Lo que este agente NO hace

> **Las skills de análisis nunca deciden elegibilidad. Su salida es soporte cognitivo para el paralegal
> y el abogado, no juicio adjudicativo del sistema.**

Este es el principio que gobierna todo el diseño, no una capa de seguridad agregada al final. El agente
no dice si un caso "vende" ni asigna una etiqueta de fortaleza. Emite, por cada uno de los seis elementos
del alivio (Acto · Medios · Fin · Presencia · Cooperación · Hardship), uno de cuatro estados —
`present` / `no_confirmado` / `bright_line_no` / `no_aplica` — cada uno con su ancla textual al intake.
Ninguno es una conclusión sobre el caso. La decisión de elegibilidad y de filing es siempre de un humano
con licencia profesional.

El porqué de fondo — automation bias, la diferencia entre gradiente fáctico y gradiente adjudicativo, y
por qué "fortaleza" no es una propiedad que el sistema pueda conocer — está desarrollado en
**[`PHILOSOPHY.md`](./PHILOSOPHY.md)**.

## Qué contiene el paquete

```
prompt/       el razonamiento + el contrato de output (el agente)
corpus/       el canon legal embebido, con procedencia (MANIFEST.md)
retrieval/    mapa determinístico: qué archivo resuelve cada duda
skills/       capacidades del agente, desglosadas y auditables
config/       versión viva, modelo, parámetros (agent.json)
evals/        vacío de casos — ver "Evaluá con tu propio golden" ↓
tools/
├── eval-runner/    el runner genérico (assemble-prompt.mjs + eval-skill.mjs)
└── canon-watch/    vigilante de frescura del statute/regulación embebidos
```

Cada carpeta tiene su propio README con una línea por archivo y un puntero a
[`retrieval/retrieval-map.md`](./retrieval/retrieval-map.md) como índice maestro — el agente nunca
adivina dónde buscar una fuente, y tampoco debería quien lo lee.

## Evaluá con tu propio golden

Este paquete llega **sin** casos de prueba. Cada firma valida contra su propia práctica, no contra la
ajena — ver [`evals/README.md`](./evals/README.md) para el porqué y cómo construir el tuyo. En resumen,
desde la raíz del repo:

```bash
# ensamblar el prompt vivo
node tools/eval-runner/assemble-prompt.mjs --out /tmp/assembled.md

# correr contra tu golden
node --env-file=.env tools/eval-runner/eval-skill.mjs \
  --skill visa-t --prompt-file /tmp/assembled.md --prompt-version <la-tuya>
```

## Frescura del canon legal

```bash
node tools/canon-watch/check-canon-freshness.mjs
```

Compara el statute y la regulación embebidos contra la fuente oficial (eCFR, govinfo/GPO) y **reporta**
si quedaron desactualizados — nunca actualiza el canon por su cuenta. Ver el script y
[`corpus/MANIFEST.md`](./corpus/MANIFEST.md) § "Vigilancia del canon" para el Policy Manual y la
jurisprudencia, que no tienen una API de versionado equivalente.

## Licencia

Apache License 2.0 — ver [`LICENSE`](./LICENSE).

## Autoría

Christopher Mena · [github.com/chrismena87](https://github.com/chrismena87)
