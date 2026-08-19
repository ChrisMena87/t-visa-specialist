---
documento: "Guía de construcción del formulario — cambios al intake de Visa T"
version: "v0"
fecha: 2026-08-15
lector: "jefatura del departamento de intake (operativo — no doctrina profunda)"
que_es: "Guía operativa para actualizar el formulario de intake vivo (TEMPLATE INTAKE 6.3.1) con las preguntas derivadas de la doctrina de Visa T. Género distinto del Manual del Visa T Specialist: aquél explica la doctrina a quien USA el form; este explica los cambios a quien lo ADMINISTRA."
fuentes: "GAP analysis módulo↔form (2026-08-15); modulo-t-preguntas-v0.md (texto aprobado verbatim); auditoría del instrumento (#415, hallazgos de calidad); form vivo TEMPLATE INTAKE 6.3.1.md."
regla: "El texto aprobado es el CONTENIDO a capturar; el operador lo encuadra (guía, no guión). Los porqués legales viven en el Manual del Visa T Specialist — se referencian, no se repiten."
---

# Guía de construcción del formulario — Visa T

*Para la jefatura de intake. Qué cambiar en el formulario actual, dónde, y por qué — sin necesidad de leer la doctrina.*

---

# 1. Resumen para la jefatura

Comparamos el **formulario actual** (6.3.1) contra el **instrumento derivado de la doctrina** de Visa T (el banco de preguntas firmado pregunta por pregunta con el abogado). Esto es lo que encontramos y lo que esta guía propone.

## Qué encontramos

- **Falta una capa entera: Hardship.** La visa exige probar que volver al país le causaría a la persona un **daño grave e inusual**. El formulario de hoy **no tiene ninguna sección de hardship** —solo un genérico "¿tiene miedo de regresar?"—. Es un requisito completo de la visa que hoy **llega vacío al abogado**.
- **Falta el nexo de la coerción.** El form pregunta las amenazas por un lado y el trabajo forzado por otro, pero **no captura el hecho que los une** —que la persona *aguantó por miedo*—, que es lo que legalmente arma la coerción.
- **Faltan los "finos" de deuda y de valor.** El form pregunta *si* hubo deuda, pero no si la deuda era una **trampa** (nunca bajaba / sin fin). Y el intercambio sexual "a cambio de algo de valor" se captura desparejo.
- **Lo que sí se captura, se captura peor.** Varias preguntas del form son **inductivas** (le sugieren "esclavo" a la persona), **binarias que revelan el umbral legal** ("¿era menor de edad?"), o **compuestas** (dos hechos en una).
- **Todo está detrás de "silos".** El form pregunta lo mismo tres veces (coyote / laboral / violencia doméstica), cada silo **gateado** por una pregunta de entrada. Si la persona no "entra" a un silo, ni las buenas preguntas se hacen.

## Qué propone esta guía

1. **Agregar ~9 preguntas nuevas** en los silos existentes (el nexo de coerción, los disyuntos de deuda, violencia presenciada, etc.) — **Sección 2**.
2. **Agregar una sección nueva de Hardship** (8 preguntas) — hoy inexistente — **Sección 2**.
3. **Mejorar la redacción** de las preguntas que ya existen pero están mal formuladas — **Sección 3**.
4. **NO reorganizar los silos todavía** — eso es cirugía mayor (el form definitivo multi-alivio), y va en el mapa a futuro — **Sección 4**.

**Lo que NO cambia:** la estructura del form, su numeración, su flujo. Esta guía **suma y mejora preguntas**, no rehace el formulario.

---

# 2. Preguntas nuevas

*Formato: cada pregunta con su texto exacto (verbatim del banco aprobado), dónde insertarla, si tiene condicional, por qué importa, y el capítulo del Manual para el porqué legal. **Regla de los tres silos:** estas preguntas se insertan en cada silo abierto (coyote / laboral / DV) — pero ver el aviso de pregunta-triplicada en la Sección 5.*

## 2.1 — En los silos existentes (capa TVPA)

### `h20` — Nexo coerción→sumisión · GAP
| Campo | Contenido |
|---|---|
| **Texto** | **20a:** "¿Aguantó cosas malas en el trabajo porque tenía miedo de lo que le podían hacer a usted o a su familia?" · **20b:** "¿Qué era lo que aguantaba?" |
| **Dónde** | Bloque de coerción de cada silo: **Labor** tras Q19 (L466) · **DV** tras Q13 (L534) · **STT** tras Q9 (L397) |
| **Condicional** | 20b solo si 20a da "sí" |
| **Por qué importa** | Sin esto el caso llega con las amenazas y el trabajo forzado por separado, pero sin el hecho que los une —aguantó *por* miedo—, que es lo que arma la coerción |
| **Manual** | Cap. 2 — Medios · Coerción |

### `15c` / `15d` — Disyuntos de la deuda · GAP
| Campo | Contenido |
|---|---|
| **Texto** | **15c:** "¿La deuda le iba bajando mientras trabajaba, o seguía igual —o crecía— por más que trabajara?" · **15d:** "¿Le dijeron cuánto tenía que trabajar y hasta cuándo, o eso no tenía fin?" |
| **Dónde** | Tras la pregunta de deuda de cada silo: **Labor** Q5 (L430) · **DV** Q7 (L518) · **STT** 3.2 (L361) |
| **Condicional** | **Sí** — solo si hubo deuda (la pregunta previa dio "sí") |
| **Por qué importa** | El form ya pregunta *si* hubo deuda; esto captura si era una **trampa** (nunca bajaba / sin fin) — el hecho que separa una deuda normal de la servidumbre por deuda |
| **Manual** | Cap. 3 — Fin · Servidumbre por deuda |

### `h9` — Violencia presenciada · GAP
| Campo | Contenido |
|---|---|
| **Texto** | "¿Vio a alguien más sufrir daño en ese lugar o situación?" |
| **Dónde** | Bloque de coerción: **STT** tras Q8 (L391) · **Labor** tras Q9 (L444) · **DV** tras Q13 (L534) |
| **Condicional** | No |
| **Por qué importa** | Ver castigar a otro **es** una amenaza —de las más fuertes—; el form no lo captura hoy |
| **Manual** | Cap. 2 — Medios · Coerción |

### `h12b` — Miedo presente · PARCIAL (el form captura el miedo de *entonces*, no el de *ahora*)
| Campo | Contenido |
|---|---|
| **Texto** | "¿Y ahora — tiene miedo de que algo le pase a usted o a su familia si no hace lo que esa persona quiere?" |
| **Dónde** | Junto al miedo ya preguntado: **STT** tras Q7.1 (L387) · **Labor** tras Q19 (L466) · **DV** tras Q11 (L530) |
| **Condicional** | No |
| **Por qué importa** | El miedo **presente** muestra que el control sigue vivo — distinto del miedo pasado; el abogado lo necesita para presencia y cooperación |
| **Manual** | Cap. 2 — Medios · Coerción (nota Aquí/Allá) |

### `14b` — Amenaza con la ley / los tribunales · PARCIAL (el form solo tiene "inmigración/policía")
| Campo | Contenido |
|---|---|
| **Texto** | "¿Alguien lo amenazó con usar la ley o los tribunales en su contra —por ejemplo quitarle a sus hijos, levantar cargos, o una demanda— para obligarlo a hacer algo?" |
| **Dónde** | Junto a la amenaza de inmigración/policía: **Labor** tras Q16 (L460) · **DV** tras Q10 (L528) |
| **Condicional** | No |
| **Por qué importa** | Amenazar con quitarle los hijos o levantar cargos es coerción legal — el form solo pregunta por inmigración/policía y se pierde el resto |
| **Manual** | Cap. 2 — Medios · Coerción (abuso del proceso legal) |

### `h6` — Aislamiento / comunicación · GAP
| Campo | Contenido |
|---|---|
| **Texto** | "¿Podía comunicarse con su familia o amigos? / ¿Alguien controlaba con quién hablaba?" |
| **Dónde** | Bloque de condiciones/control: **Labor** tras Q8 (L442) · **DV** tras Q19 (L546) |
| **Condicional** | No |
| **Por qué importa** | El aislamiento es textura de servidumbre; el form pregunta si podía salir, no si podía **comunicarse** |
| **Manual** | Cap. 3 — Fin · Servidumbre involuntaria |

### `h7c` — Atención médica impedida · GAP
| Campo | Contenido |
|---|---|
| **Texto** | "¿Alguna vez sufrió un accidente o se enfermó ahí? ¿Se le impidió buscar atención médica?" |
| **Dónde** | Bloque de condiciones de trabajo: **Labor** tras Q4 (L428) · **DV** tras Q5 (L510) |
| **Condicional** | No |
| **Por qué importa** | Bloquear el cuidado médico es servidumbre **y** siembra el hardship futuro (la condición médica sin tratar) — doble uso |
| **Manual** | Cap. 3 — Fin · Servidumbre (+ siembra Cap. 6 Hardship) |

### `h19` — Deuda no-monetaria · GAP
| Campo | Contenido |
|---|---|
| **Texto** | "¿Se sentía en deuda con esa persona, aunque no fuera una deuda de dinero?" |
| **Dónde** | Tras la deuda formal de cada silo: **Labor** tras 15c/15d · **DV** tras Q7 (L518) |
| **Condicional** | No |
| **Por qué importa** | Hay deudas que no son de dinero (favores, "te traje", "te mantengo") que igual atan; el form solo pregunta deuda monetaria |
| **Manual** | Cap. 3 — Fin · Servidumbre por deuda |

### `h2` — Movimiento presente · PARCIAL (el form pregunta el movimiento en pasado)
| Campo | Contenido |
|---|---|
| **Texto** | "¿Es libre de ir y venir?" *(en presente)* |
| **Dónde** | Junto a la pregunta de libertad ya existente: **DV** tras Q19 (L546) · **Labor** tras Q18 (L464) |
| **Condicional** | No |
| **Por qué importa** | Si la situación sigue **activa hoy**, cambia el análisis de presencia; el form solo pregunta si *podía* irse (pasado) |
| **Manual** | Cap. 1 — Actos · Harboring (tiempo del verbo) |

## 2.2 — Sección nueva de Hardship (capa INA)

*El form no tiene sección de hardship. Se crea un bloque nuevo, al final, antes de "Cooperación y miedo creíble" (L570). Narrativa abierta, sin inducir. Todas remiten al Cap. 6 del Manual.*

| ID | Texto (verbatim) | Condicional | Por qué importa |
|---|---|---|---|
| **#H5 (a/b)** | (a) "¿Necesita atención médica o de salud mental —algo que esté tratando ahora o que necesite tratar?" · (b) "Eso que necesita, ¿lo podría conseguir en su país? ¿Por qué sí o por qué no?" | (b) solo si (a) da algo | Salud que no consigue allá = hardship directo |
| **#H6 (a/b)** | (a) "De lo que vivió, ¿hay cosas que todavía le afectan hoy —el ánimo, el sueño, la salud, el día a día? ¿Cómo?" · (b) "¿Ha visto a alguien por eso —un doctor, psicólogo o consejero? ¿Le dieron algún papel o evaluación?" | No | El daño que quedó; la (b) surfacea si falta evaluación → **referral ahora**, no al armar el caso |
| **factor 5 (a/b)** | (a) "¿Le podría traer problemas con las autoridades de allá algo de lo que le pasó o la obligaron a hacer?" · (b) "Si en su país se supiera lo que vivió, ¿qué pasaría con usted —con su familia, su comunidad, su iglesia? ¿La tratarían distinto, la culparían, la rechazarían, o correría peligro?" | No | Leyes/estigma que la castigarían al volver |
| **factores 6/7** | (7) "Si tuviera que volver, ¿esas personas —o gente de ellos— podrían encontrarla o hacerle daño allá?" · (6a) "¿Cree que podría volver a caer en una situación así?" · (6b) "Y si algo le pasara allá, ¿la policía o las autoridades la ayudarían? ¿Por qué sí o por qué no?" | No | Alcance del tratante + si el Estado la protegería (6b es lo que hoy no se pregunta) |
| **factor 8** | "La zona a la que tendría que volver —su pueblo o su ciudad— ¿cómo está hoy? ¿Hay guerra, violencia o conflicto que la pondría en peligro?" | No | Peligro de la zona concreta, no clima general del país |
| **factor 4** | "¿Tiene aquí algún caso o trámite en marcha —o que podría empezar? (cargos contra esas personas, una demanda, dinero que le deban, una orden de protección). ¿Qué pasaría con eso si tuviera que irse?" | No | Lo que perdería del sistema de justicia de EE.UU. |
| **factor 9** | "Si tuviera que volver, ¿cómo se sostendría usted y quienes dependen de usted? ¿Volver la dejaría en una situación económica difícil?" | No | Daño económico del retorno (hoy ya no está vedado) |

*(El detalle legal de cada factor y por qué "la suficiencia la pesa el abogado" está en el Cap. 6 del Manual.)*

---

# 3. Preguntas a mejorar

*Preguntas que el form YA hace, pero mal formuladas. La columna "qué está mal" viene de la auditoría de calidad del instrumento (#415). El reemplazo es el texto aprobado del banco.*

### Las preguntas inductivas de "esclavo"
| Campo | Contenido |
|---|---|
| **Actual (form)** | STT 5.5 (L377): "…orientar al cliente si lo hacía sentir como su esclavo, como un animal…" · Labor Q22 (L478): "…como alguien obligado a trabajar… (un esclavo, herramienta, etc.)" · DV 5.1 (L512): "…como si usted fuera un esclavo / criado / parte de su propiedad…" |
| **Qué está mal** | **Inductiva** — le pone la palabra "esclavo" en la boca a la persona. Contamina el hecho: el abogado necesita que la servidumbre salga de los **hechos** (no poder irse, sin pago, sin descanso), no de una etiqueta sugerida |
| **Reemplazo** | Las preguntas de servidumbre por hechos del banco: **h5** (pago/control), **h6** (aislamiento), **h7** (horas/descanso/cuidado) — capturan la servidumbre **sin decir nunca "esclavo"** |
| **Manual** | Cap. 3 — Fin · Servidumbre involuntaria |

### La pregunta binaria de edad
| Campo | Contenido |
|---|---|
| **Actual (form)** | STT Q2 (L352): "¿Era menor de edad cuando esto sucedió? SI/NO" · DV Q4 (L508): "¿Era menor de edad cuando esto sucedió?" |
| **Qué está mal** | **Binaria que revela el umbral** — le avisa a la persona que "18" es el número mágico (riesgo de respuesta inducida). Además pierde la edad exacta |
| **Reemplazo** | **h21** (abierta): "¿Qué edad tenía usted cuando pasó lo que me contó?" — captura el número exacto **sin revelar el umbral**; el gate de <18 lo evalúa el abogado |
| **Manual** | Cap. 5 — Cooperación (exención por edad) |

### El miedo de retorno genérico
| Campo | Contenido |
|---|---|
| **Actual (form)** | L72: "¿Tiene usted miedo de regresar a su país? SI/NO" |
| **Qué está mal** | **Demasiado genérico** — un sí/no no captura *qué* daño teme, que es lo que el hardship necesita |
| **Reemplazo** | La **sección nueva de Hardship** (2.2) desglosa el miedo en sus factores (salud, estigma, tratante, conflicto, economía). La de L72 puede quedar como puerta de entrada, pero el contenido lo capturan los factores |
| **Manual** | Cap. 6 — Hardship |

---

# 4. Lo que NO se toca todavía

**El problema de los silos.** El formulario captura la trata **tres veces** —un silo para coyote (STT), uno laboral, uno de violencia doméstica—, y cada silo se abre con una **pregunta-puerta** ("¿fue víctima de abuso laboral? NO → saltar"). Esto tiene dos costos: (a) la **misma pregunta se repite** en los tres silos; (b) si la persona no se **auto-identifica** en un silo, las buenas preguntas de ese silo **nunca se hacen** —aunque su caso las necesitara—.

**Por qué no lo tocamos ahora.** Arreglar esto es **cirugía mayor**: significa reorganizar el formulario alrededor del **hecho** (¿hubo control? ¿hubo deuda?) en vez del **escenario** (¿fue coyote/laboral/DV?). Eso es el **formulario definitivo**, que se diseñará cuando existan los otros specialists (el form multi-alivio). Esta guía **mejora el form actual sin reorganizarlo** — suma y arregla preguntas dentro de la estructura que ya hay.

**Que la jefatura lo sepa:** la cirugía mayor existe y está en el mapa. Lo de esta guía es la mejora incremental que se puede hacer **hoy, sin rehacer nada**.

---

# 5. Notas de implementación

- **Pregunta triplicada — no repetir.** Como las preguntas nuevas se insertan en los tres silos, si la persona **ya respondió** una pregunta en un silo abierto, el operador **no la repite** en el siguiente: anota *"ver respuesta en sección X"*. La deduplicación de verdad es parte del rediseño de silos (Sección 4) — por ahora, esta nota evita la fatiga de repetir.
- **Guía, no guión.** El texto aprobado es el **contenido a capturar**, no un libreto a leer palabra por palabra. El operador lo **encuadra** según el tono y el momento de la conversación —una persona contando algo difícil no está llenando un formulario—. Lo que no cambia es *qué hecho* hay que sacar.
- **Guías de operador que acompañan preguntas:**
  - **Deuda (h15):** si la persona dice que no debía nada, enumerar las fuentes que quizá no registra como deuda — *"¿o el lugar donde vivía, la comida, algo que le descontaban?"*.
  - **Edad (h21):** la edad se ancla **por evento** — si la persona relató más de una situación, se pregunta la edad para **cada una**.
- **Pendiente de cotejo (SOAR).** Algunas preguntas nuevas son traducción propia de un instrumento de screening en inglés (SOAR); están marcadas *pendientes de cotejo* contra la versión oficial en español si la fuente responde. **No bloquea** su uso — el contenido es correcto; puede ajustarse la redacción exacta después.
- **El porqué legal vive en el Manual.** Esta guía dice *qué* cambiar y *dónde*; el *por qué* legal de cada pregunta está en el **Manual del Visa T Specialist** (referenciado por capítulo en cada fila). Para dudas de fondo, ese es el documento.

---

*Fuente de verdad de los textos: el banco aprobado (`modulo-t-preguntas-v0.md`). Los hallazgos de calidad: la auditoría del instrumento (#415). El detalle del GAP: el análisis módulo↔form (2026-08-15). Sin PII.*
