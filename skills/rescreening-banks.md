# Skill — bancos de rescreening + gap ejecución vs diseño

> **Espejo documental.** La fuente de verdad es `../prompt/reasoning.md §4`. Este archivo desglosa la
> capacidad para auditarla; no la re-define. Si §4 y esto divergen, **gana §4** (el prompt es el ensamble).

## Qué hace

Cuando un elemento queda `no_confirmado`, el agente nombra **por qué** falta — porque dispara acciones
humanas distintas:

- **Gap de EJECUCIÓN** — la pregunta existe en el formulario y no se hizo (sección abreviada, salto).
  Acción: **re-preguntar** (la pregunta canónica ya existe — los bancos de abajo).
- **Gap de DISEÑO** — el formulario no tiene la pregunta (Hardship entero; nexo de Presencia; finos de
  deuda). Acción: **entrevista dirigida** — no hay pregunta que "repetir"; hay que construir la captura.

## Los 6 bancos (rescatados verbatim del canon operativo)

**Nota de reconciliación (contradicción interna cerrada).** Los bancos literales (las preguntas mismas) NO
viven en `corpus/` — viven **únicamente** en `../prompt/reasoning.md §4` (verificado: `corpus/capture/`
no contiene ninguno de los 6 bancos, ni la distinción gap-ejecución/gap-diseño — ver
`retrieval/retrieval-map.md §10 obs.5`). Lo que sí vive en `corpus/` es el **canon detrás** de cada
banco — la doctrina que justifica por qué esas preguntas importan, no las preguntas.

| Banco | Cubre | Canon detrás (ruteo completo en `retrieval-map.md`) |
|---|---|---|
| Fin de explotación dentro de DV | labor/servicio forzado dentro de violencia doméstica | §5 "Lo tenían encerrado con llave" · §4 `#F2`/`#F3` |
| Labor trafficking by parent / familiar cercano | control de ingresos por familiar, amenaza a terceros | §5 "Un familiar controlaba sus ingresos" |
| Labor trafficking via control de visa | amenaza migratoria/estatus como coerción laboral | §5 "El sponsor amenazó con cancelarle la visa" · §4 `#M9`/`#M10` |
| Sex trafficking quid-pro-quo (no-pareja) | sexo condicionado a recurso, articulación del trade-off | §5 "El jefe condicionó el empleo..." · §4 `#F12`/`#F13` |
| Fin de explotación durante smuggling | labor/ sexo extraído en tránsito; debt bondage vs ransom | §5 "Vino con coyotes..." / "Un coyote la separó..." · §4 `#F2b`/`#F2c` |
| Extreme hardship (elemento IV) — por factor | los 9 factores del §214.209(b), casi siempre gap de DISEÑO | §3 fila Hardship · §4 `#H1`-`#H6` |

Las preguntas literales de cada banco viven en `../prompt/reasoning.md §4`. Uso: embeber 2-3 por caso,
las que más muerdan. Para el canon que respalda cada banco, el **índice maestro** es
`../retrieval/retrieval-map.md` — no se duplica su contenido acá.
