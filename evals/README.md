# `evals/` — construí tu propio golden

Esta carpeta llega **vacía de casos**, a propósito. El repo de origen usa un golden set propio como red
de regresión permanente — esos casos **no viajan** con el paquete público.

## Por qué (es doctrina, no una limitación)

Cada firma valida contra **sus propios casos**, no contra los ajenos. Un golden set es, en el fondo, un
conjunto de juicios sobre qué constituye evidencia suficiente en la práctica real de una firma concreta
— y ese juicio no se importa de otra firma sin importar también su apetito de riesgo, su jurisdicción, y
los patrones de caso que efectivamente atiende. Entregar el golden de origen junto con el prompt sería
pedirle a quien lo adopte que confíe en un juicio ajeno sin poder auditarlo — exactamente lo que este
proyecto evita en todas sus otras capas (ver `PHILOSOPHY.md`, especialmente §6 y §7: la autoridad viene
de la evidencia que se puede mostrar, no de la posición que se ocupa).

## Cómo construir el tuyo

1. **Formato**: cada caso es un archivo markdown con frontmatter YAML (`id`, `relief`, assertions
   esperadas) + el cuerpo del intake. Mirá `tools/eval-runner/eval-skill.mjs` — el parser define el
   contrato exacto que un caso debe cumplir.
2. **Contrato de assertions**: `prompt/contract.md` define los 6 estados de cobertura
   (Acto/Medios/Fin/Presencia/Cooperación/Hardship) y el header de 3 estados que el runner parsea. Un
   caso golden declara qué estado espera el runner para cada elemento.
3. **Cantidad mínima**: no hay un número mágico, pero menos de ~8-10 casos no estresa lo suficiente el
   espacio de estados (4 estados × 6 elementos) para que la corrida signifique algo. Empezá con los casos
   reales que ya tenés anonimizados; agregá sintéticos para cubrir los estados que tus casos reales no
   tocan.
4. **Correr contra el prompt** (desde la raíz del repo):
   ```bash
   node tools/eval-runner/assemble-prompt.mjs --out /tmp/assembled.md
   node --env-file=.env tools/eval-runner/eval-skill.mjs \
     --skill visa-t --prompt-file /tmp/assembled.md --prompt-version <la-tuya>
   ```
5. **Sellar un baseline**: una vez que tu golden refleja tu propio criterio, `--save-baseline` lo sella
   como línea base — cualquier cambio futuro al prompt se mide contra tu propio baseline, no contra el
   nuestro.

## Lo que sí viaja con el paquete

- `tools/eval-runner/` — el runner genérico. No sabe nada de tus casos; los lee del formato, sea el que
  sea.
- `tools/canon-watch/` — el vigilante de frescura del canon legal (statute/regulación), que no depende
  de ningún golden.
- `prompt/` + `corpus/` + `retrieval/` + `skills/` — el agente completo, con su corpus legal embebido y
  trazable (ver `corpus/MANIFEST.md`).

El agente funciona sin un golden propio — pero **evaluarlo antes de confiar en él en producción** es la
disciplina que este proyecto practica sobre sí mismo, y la misma que te va a servir a vos.
