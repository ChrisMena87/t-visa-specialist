# Cómo se construye un asistente legal que no decide

### Criterios de diseño del T-Visa specialist

> [!CAUTION]
> **This software is not a substitute for the advice of an attorney. / Este software no sustituye el
> consejo de un abogado.** Es un laboratorio experimental: no está en producción, no se ha utilizado
> para evaluar ningún caso de ningún cliente, y ninguna decisión legal o comercial se ha tomado a
> partir de esta herramienta. Uso previsto: bajo supervisión de abogados con licencia. Ver el aviso
> completo en el [README](./README.md).

---

## 1. Por qué existe

> **Democratizar el acceso a evaluaciones y servicios legales de calidad y costo accesible para
> aquellos que no podrían pagar una firma seria.**
> — ADR-027, *Vocación del proyecto: el círculo dorado*

Cuatro palabras hacen el trabajo. **Democratizar**: el cliente que importa por defecto es el que hoy no
tiene acceso. **Evaluaciones y servicios**: no sólo actuar, también analizar — el sistema sirve cuando
alguien viene a saber qué tiene, incluso si no contrata. **Calidad**: no se rebaja para abaratar; la
democratización pierde sentido si la versión accesible es peor. **Costo accesible**: no necesariamente
gratis, sí alcanzable para el segmento desatendido.

Una distinción que conviene decir en voz alta porque casi nadie la dice: **el beachhead comercial y el
destinatario último no son la misma persona.** Quien paga primero puede ser una firma boutique; a quien
se le debe el producto en última instancia es a la persona desatendida. Confundirlos es cómo un
proyecto con vocación termina construyendo sólo para quien firma el cheque.

De ahí sale la regla de qué construimos y qué no. La AI hace **lo que es inherentemente AI** —operar
sobre el corpus completo a la vez, memoria sin fatiga, ausencia de sesgo de orden, ausencia de
tribalismo entre áreas legales—. La AI **no hace** lo que es inherentemente humano: empatía, rapport,
juicio social, lectura de credibilidad, presencia. Cuando la máquina absorbe la carga cognitiva fría, el
abogado queda libre para ser lo que el cliente desatendido más necesita: alguien que entiende su
historia y lo acompaña en el tiempo. El abogado deja de ser principalmente *técnico legal* y se vuelve
**super trabajador social** (ADR-027 §How.2).

Y de ahí salen las **anti-features explícitas** — quedan fuera por vocación, no por regulación, y la
diferencia importa porque *la regulación se sortea con asesoría legal y la vocación no* (ADR-027):

- Voice agents que fingen empatía o rapport con el cliente final.
- "Detección de mentiras" o evaluación de credibilidad sobre el testimonio.
- Predictores que venden certeza de outcome ("tu caso tiene 73% de probabilidad").
- Agentes que se identifican como humanos ante el cliente final.

Una lista de prohibiciones que vive sólo en un documento no defiende nada, así que ésta es un **gate de
review**: corre **antes** de mirar calidad de código, porque si el filtro falla, el código todavía no
importa. La distinción que ordena el filtro es entre **AI generativa** —estructurar, sugerir, resumir,
extraer, identificar candidatos para revisión profesional: sólido— y **AI predictiva vendida como
certeza** —"tu caso ganará", "este cliente miente", "este alivio aplica" sin que un humano revise:
snake oil estructural—. También fija cómo se enuncia el output: *"candidatos a evaluar" sí; "califica
para X" no.*

Y una pregunta final que es la más incómoda y la más útil:

> *Si el cliente final entendiera exactamente qué hace esta feature, qué datos usa, y cuál es su tasa
> de error real — ¿la usaría con la misma confianza?*

Si la respuesta es "probablemente no", la feature **se está vendiendo mejor de lo que es**. Eso es snake
oil sin importar la sofisticación técnica que tenga (`docs/snake-oil-filter.md`).

---

## 2. No-adjudicación: el principio constitutivo

> **Las skills de análisis NUNCA deciden elegibilidad.** Su salida es soporte cognitivo para el
> paralegal y el abogado, no juicio adjudicativo del sistema.
> — el séptimo principio del proyecto

Este es el principio del que cuelga todo lo demás. No es una capa de seguridad agregada al final: es la
forma del sistema.

El modo de falla que previene es **estructural, no tecnológico**. Está documentado en la literatura de
aviación y medicina como *automation bias*: cuando un sistema —con AI o sin ella, da igual— ocupa el
espacio del juicio humano, la responsabilidad se diluye entre capas. Cada capa confía en la siguiente.
El resultado puede ser fraude deliberado (el profesional se escuda en "el sistema lo aprobó") o
negligencia distribuida: nadie decide mal, todos confían en la capa anterior, y el cliente termina con
un filing débil o un retainer cobrado sin posibilidad real de aprobación.

En visas humanitarias el daño **siempre cae del mismo lado**: exposición a enforcement, denegaciones,
dinero gastado por personas que no lo tenían.

El mecanismo concreto que lo dispara es banal y por eso peligroso. El flujo real de una firma es
`intaker → paralegal QA junior → abogado que firma`, y el abogado revisa a velocidad de *"50 intakes en
5 minutos"*. **Si la skill ocupa el espacio cognitivo del paralegal con un veredicto cerrado, el
paralegal hace eco; si el paralegal hace eco, el abogado firma sobre eco.** La cadena de revisión se
colapsa sin que nadie haya hecho nada malo (ADR-032, Contexto).

Por eso los disclaimers no alcanzan. Se consideró explícitamente mantener las etiquetas conclusivas
agregando advertencias fuertes, y se rechazó: *"los disclaimers no protegen del automation bias… el
paralegal junior lee el label, no el disclaimer. **La palabra es el sesgo.**"* (ADR-032, Alternativas).

---

## 3. Evaluación de evidencia, no veredicto

La primera versión del sistema clasificaba casos como `VENDE_ALTA`, `VENDE_CAVEATS`, `NO_VENDE`. Esa
taxonomía **está muerta** y vale explicar por qué, porque el porqué es más útil que el reemplazo.

### Había dos gradientes, no uno

- **Gradiente fáctico** — ¿los hechos que constituyen los elementos están establecidos en el intake?
  **Sí es del sistema.** Es verificable contra el formulario y el intake.
- **Gradiente adjudicativo** — dados los hechos, ¿el caso es A/B/C para que la agencia lo apruebe?
  **No es del sistema.** Es del abogado, y es **apetito de riesgo del negocio**: dos abogados
  competentes califican distinto el mismo intake porque tienen apetitos distintos. Algunas firmas
  venden sólo A; otras venden A/B/C.

De ahí la razón profunda, más fuerte que la regla: **la skill no puede clasificar fortaleza porque la
fortaleza no es propiedad del caso.** Es función de la lente del abogado. Cualquier etiqueta de fuerza
que el sistema emita pretende conocer un apetito de riesgo que no le pertenece — y ese pretendido
conocimiento se convierte en escudo ("el sistema lo aprobó"), que es exactamente la trampa (ADR-034).

Había también un problema mecánico: las siete categorías originales eran **un gradiente disfrazado de
clases**. Entre "fuerte" y "parcial" no hay frontera objetiva. Pedirle a un modelo que clasifique un
continuo en clases discretas hace que colapse hacia la categoría más simple. Ningún refinamiento del
prompt lo arregla: **el bug emerge del marco, no del modelo** (ADR-034, Causa raíz).

### Lo que emite el sistema

Cuatro estados por elemento, y **ninguno es una conclusión sobre el caso** (ADR-035):

| Estado | Qué dice | Acción que dispara |
|---|---|---|
| `present` | Hay evidencia afirmativa capturada en el intake. **No** significa elemento legalmente satisfecho ni caso fuerte. | continuar |
| `no_confirmado` | El intake no capturó lo suficiente. **Ausencia de evidencia, NO evidencia negativa.** | rescreening |
| `bright_line_no` | Respuesta negativa dispositiva a una pregunta concreta. Exige `source_question` + `source_answer`. | cerrar el vector |
| `no_aplica` | El vector no pertenece al caso según los hechos capturados. | excluir el vector |

La frase que más trabajo hace en todo el sistema: **`no_confirmado` significa "no se capturó", jamás "no
califica".** Dado el perfil de falsos negativos en trata —miedo, no-comprensión, no-recuerdo— el
silencio no prueba que algo no ocurrió (ADR-034 §4).

Tres reglas de forma sostienen eso (ADR-035):

- **`basis` obligatorio en todos los estados.** Sin ancla a preguntas o hechos concretos del intake, no
  hay estado. El modelo no puede afirmar sin mostrar dónde lo leyó.
- **`bright_line_no` exige `source_question` + `source_answer` estructurados**, no enterrados en prosa.
  Cerrar un vector es el acto más consecuente del sistema, así que es el que más rastro deja.
- **Prohibido cualquier estado de fuerza** (`partial`, `weak`, `strong`, `likely`). La debilidad
  observable se describe en prosa para el abogado, nunca como campo.

Y una propiedad horneada en la geometría: **el residual bajo ambigüedad es `no_confirmado` → preguntar
de nuevo, nunca `bright_line_no` → cerrar.** El modo de falla conservador no es una instrucción que el
modelo pueda olvidar; es la forma del espacio de estados (ADR-035).

"Elementos completos" tampoco significa "vende". Significa que los hechos están en el intake. Si el
abogado decide ir, **el reframe legal vive en el filing** —declaración y cover letter—, no en el intake
ni en la skill. Confundir esas capas degrada cada disciplina (ADR-034 §8).

---

## 4. Soporte cognitivo: concentrar el juicio humano, no reemplazarlo

La pregunta de diseño no es *"¿cuánto puede decidir la máquina?"* sino *"¿dónde tiene que estar mirando
el humano?"*. Un sistema que decide poco pero **concentra la atención del abogado en las tres cosas que
sólo él puede resolver** vale más que uno que decide mucho y lo deja revisando ruido.

El motor de análisis se diseña como **cadena de filtros socráticos, no como pipeline de decisión**
(ADR-032 §4). Cada capa fuerza a la siguiente a pensar:

- el recomendador de intake fuerza al intaker a re-capturar lo que falta;
- el specialist fuerza al paralegal a rescreenear o repensar antes de pasar al abogado;
- la firma del abogado es el cierre.

**Ninguna capa cierra el juicio de la capa siguiente. Cada una alimenta su insumo.**

Concretamente, cada duda que aparece se rutea a uno de tres destinos:

| Lo que aparece | A dónde va | Por qué |
|---|---|---|
| **Un gap** — el intake no capturó el hecho | → **una pregunta** (rescreening) | `no_confirmado` tiene una sola acción de funnel: volver a preguntar (ADR-035) |
| **Una frontera generalizable** — el mismo umbral se repite caso tras caso | → **una regla firmada** por un humano con licencia | La autoridad dispositiva sólo puede existir donde la regla es humana, explícita y auditable (ADR-035); la regla se modela como entidad con `approved_by`, `rationale`, `effective_date` (ADR-036) |
| **Una frontera particular** — este caso, este umbral, este apetito de riesgo | → **el abogado** | Es el gradiente adjudicativo, que no es del sistema (ADR-034 §6) |

> El *criterio de promoción* —cuándo una frontera es lo bastante generalizable para volverse regla
> firmada— es **criterio abierto: se define con la práctica**, no con un umbral horneado de antemano.
> El funnel de arriba es fiel a las fuentes en sus tres destinos; el umbral de la fila del medio se va
> fijando caso a caso, con la autoridad de un abogado con licencia, en vez de simular que ya existe uno.

La ganancia real: el abogado deja de gastar atención en *encontrar* lo que falta y la gasta en *decidir*
lo que sólo él puede decidir. Eso es lo que quiere decir "liberar al humano para que sea más humano".

Hay un límite ético en la misma frontera. El sistema persigue **lo que el cliente está dispuesto a
revelar ante preguntas competentes y honestas, no la verdad material**. No inventamos, no exageramos, no
hacemos leading ni pushing. Ante negación competente en todos los vectores, el análisis se cierra —
aunque sepamos que un falso negativo por miedo es posible. La alternativa (empujar para extraer
testimonio) produce el daño que más importa evitar en trata: testimonio inducido, revictimización, y un
caso que colapsa ante el adjudicador. **La negación competente es el piso del sistema: un pase honesto,
no un bucle** (ADR-034 §7).

---

## 5. Anti-gradiente: lo que puede ser tabla, es tabla

Un principio de ingeniería que resultó ser también un principio ético.

Cada vez que se le pide a un modelo de lenguaje que resuelva algo que **podría haber sido una
estructura**, pasan dos cosas malas a la vez: el resultado se vuelve inestable —los modelos colapsan
continuos hacia la categoría más simple (ADR-034)— y la decisión se vuelve **opaca**, porque queda
dentro del modelo en vez de estar escrita donde alguien pueda discutirla.

El criterio operativo que ordena esto es la **monotonicidad operacional**: *una categoría existe si y
sólo si dispara una acción distinta*. Es un test más fuerte que cualquier argumento semántico. `partial`
murió por ese test: a veces significaba "pregunta más", a veces "que lo vea el abogado", a veces "sólo
una nota" — no tenía acción propia, así que no era una categoría (ADR-035).

La consecuencia arquitectónica más nítida está en cómo se separan el modelo y las reglas (ADR-036):

- **El specialist NO consulta reglas.** Emite el estado con su `basis`, su `source_question` y su
  `source_answer` — un evento fáctico sobre el intake.
- **El motor** —capa separada— verifica si alguna regla humana matchea ese `(pregunta, respuesta)` y
  aplica lo que esa regla autoriza.

El modelo no sabe qué reglas existen. Ese desacoplamiento es lo que permite que el mismo specialist
sirva a firmas con doctrinas distintas, y —más importante— **mantiene la autoridad dispositiva fuera del
modelo de lenguaje**, en una entidad humana y auditable.

Mismo principio en el retrieval: el agente **no adivina dónde buscar**. Un mapa determinístico liga cada
disparador a su fuente exacta dentro del corpus, y *"un alias que no esté en la tabla no es una ruta"*.
Si un disparador no tiene fila, la respuesta no es improvisar la fuente — es declarar el hueco
(`retrieval/retrieval-map.md`).

Destilado en una línea: **el LLM lee lo que no puede ser estructura; todo lo demás es tabla.**

El corolario es que la estructura tiene que estar construida **para el error, no para el acierto**. Todo
output de AI lleva undo, override (editarlo a mano) y "marcar como incorrecto" — y esa señal de
corrección **se persiste y alimenta las evals**. La regla de review es explícita al respecto: si la
respuesta a alguna de esas es *"no hace falta porque el output es bueno"*, se para. **El output va a
fallar; la única pregunta es cuándo y cómo lo corrige el humano** (`docs/snake-oil-filter.md`). Un
sistema que no tiene dónde registrar su propio error no es confiable: es sólo silencioso.

---

## 6. Jerarquía de autoridad y fidelidad a la fuente

Un sistema legal que cita mal es peor que uno que no cita.

Las afirmaciones doctrinales se anclan en una **jerarquía de autoridad** explícita —estatuto,
regulación, política de la agencia, jurisprudencia— y el nivel **viaja con la cita**: un fallo de
distrito y un estatuto no pesan igual, y el output no debe aplanarlos.

### La jerarquía es una elección, y la mostramos

Acá conviene ser transparente en lugar de decretar. **No existe una única jerarquía correcta que
podamos entregar empaquetada**: el orden depende de para qué se la usa, y cada firma —cada abogado
responsable— tendrá que **hacerla propia**. Nosotros elegimos la nuestra y la dejamos a la vista, que es
lo único honesto que se puede hacer con una decisión que no es universal.

Nuestra elección son **dos órdenes para dos preguntas distintas**, y confundirlos es el error que vale
evitar:

| La pregunta | El orden que usamos | Por qué |
|---|---|---|
| **¿Qué manda como derecho?** (autoridad de la ley) | estatuto → regulación → jurisprudencia → política de la agencia | Es la jerarquía de fuentes del derecho. Un manual de política no supera a un tribunal (ADR-034 §3) |
| **¿Cómo va a resolver esto el adjudicador?** (orden de consulta del agente) | estatuto → regulación → **política de la agencia** → jurisprudencia persuasiva | El agente evalúa **cómo adjudicaría la agencia**; su manual de política gobierna al adjudicador aunque no gobierne a un tribunal. Los casos **persuaden, no mandan** (decisión 2026-08-19) |

La diferencia no es una inconsistencia: es que **"qué es más autoritativo" y "qué predice mejor la
decisión que estamos anticipando" son preguntas distintas**, y un sistema que las colapsa va a citar
bien y predecir mal, o al revés.

Por eso el paquete está diseñado para que **esa elección sea configurable, no horneada**. Es la misma
lógica que mantiene las reglas dispositivas fuera del modelo (§5): si la doctrina de cada firma vive en
entidades humanas y auditables, su jerarquía de consulta también debe poder vivir ahí. Una firma con
otro apetito, otra jurisdicción u otro foro tiene que poder ordenar sus fuentes distinto **sin tocar el
motor** — y sin heredar en silencio la elección de otro.

Dos disciplinas sostienen la fidelidad, y las dos nacieron de errores reales:

**Verbatim contra la fuente cruda, no contra el resumen.** Una premisa central del framework —que cierto
tipo de daño era una exclusión categórica— resultó ser una **mala lectura de la propia fuente**: el
texto real decía *"generally… solely… totality"*, y la lectura endurecida había soltado esas tres
palabras. El cierre no cayó por jerarquía; cayó por leer el original. De ahí la regla: **verbatim sobre
paráfrasis en toda fuente que sostenga un cierre** (ADR-038). Y su corolario incómodo: cuando una
corrección así aparece, **es retroactiva** — se re-revisa todo caso previo que se apoyó en la lectura
corregida, no sólo el que la surfaceó.

**La jerarquía es un instrumento para el conflicto, no una explicación por defecto.** Cuando dos niveles
coinciden, lo que resuelve es la coincidencia, no el outranking. No se gasta la jerarquía
retroactivamente en casos que no tuvieron conflicto (ADR-038 §5).

A eso se suma el modo de falla real del RAG legal, que no es el que se suele nombrar: **no es la cita
inventada** —un corpus verificado la cubre— **sino la cita real pegada a una provisión que ya cambió**.
El antídoto es tratar la vigencia como dato de primera clase (`effective_date`), no como suposición
(ADR-036).

---

## 7. El método

El método de construcción es parte del producto. Un sistema cuya tesis es "deje rastro" no puede
construirse sin dejarlo.

**Auditabilidad sobre perfección.** No porque la corrección no importe, sino como jerarquía cuando las
dos compiten: entre un sistema que parece más certero pero es opaco y uno que admite su incertidumbre
pero es trazable, se elige el segundo. *"La perfección es una propiedad que se reclama; la auditabilidad
es una que se ofrece. La perfección le pide al otro que confíe; la auditabilidad le da los medios para
verificar y, si hace falta, contradecir"* (`docs/fundamento.md`). Con su propia cautela: el principio
vale cuando la auditabilidad *compite* con la perfección, nunca cuando la *reemplaza*. Usar "total, es
auditable" para no arreglar una regla deficiente invierte el principio.

**Objetividad parcial.** Los dominios humanos son interpretables por naturaleza, y eso no es un defecto
a reparar con más formalización. Pero interpretable no es relativista: hay lecturas correctas y lecturas
insostenibles. Las dos alternativas destruirían el proyecto — el objetivismo duro llevaría a que el
sistema decida (viola el séptimo principio); el relativismo volvería inútil la auditoría. El proyecto
vive en el medio, y esa es *"la más exigente de las tres posturas: quien la sostiene carga con
argumentar cuál lectura es mejor y por qué, sabiendo que su argumento es contestable"*
(`docs/fundamento.md`).

**La autoridad viene de la evidencia que se puede mostrar, no de la posición que se ocupa.** Aplica al
specialist, a la regla, al abogado — y también al examen. Cuando el eval y el caso chocan, **ninguno de
los dos retiene presunción de corrección**: se abre el caso y decide la evidencia. La presunción no se
pierde automáticamente; se pierde **por trabajo** (ADR-037 Regla 1). Y toda corrección del ground truth
lleva la misma autoría auditable que el sistema exige de un cierre — *"sin ese rastro, 'auditamos el
ground truth' se vuelve el eufemismo de 'ajustamos el examen'"* (ADR-037 Regla 3).

**El consenso no es señal de verdad.** Tres análisis independientes coincidieron una vez en el
diagnóstico equivocado porque los tres compartían una premisa oculta. El antídoto no es un análisis más
listo: es ir al **dato crudo** que probaría o rompería la premisa que todos asumen. Disciplina:
**cuando todos coinciden, hacer explícita la premisa compartida y verificarla contra el dato primario**
(ADR-037 Regla 5).

### El mentor de AI

Este rol no se diseñó en abstracto: **se practicó primero, se formalizó después, y se nombró al final.**

Empezó como una práctica de trabajo en mayo de 2026 — sesiones **dialécticas** donde dos modelos
distintos operaban como **contrapesos por turnos**, con el fundador como filtro humano. La regla que
emergió de ahí es la que sostiene todo lo demás: **reforzar la dinámica dialéctica con filtro humano,
no validación mutua entre AIs.** Dos modelos que se dan la razón no producen verdad; producen un punto
ciego con dos testigos.

Esa práctica se formalizó como un **rol de orquestación** con una línea de autoridad explícita —quién
verifica conformidad y quién decide— y hoy el fundador le pone nombre: **el mentor de AI**.

Es un tercer rol que se sienta sobre el humano y sobre el AI ejecutor, y cuya función no es producir
trabajo ni aprobarlo, sino **cuestionar con rigor epistemológico y lógico a los dos lados**.

- **Al humano**: ¿de dónde sale esa premisa? ¿es coherente con lo que firmaste antes? ¿esa cita dice lo
  que decís que dice?
- **Al AI ejecutor**: ¿esto cumple la spec o sólo lo parece? ¿esto es evidencia o es tu reporte de que
  hay evidencia?

La distinción operativa que hace útil el rol: **verificar contra la fuente, no contra el reporte de
quien hizo el trabajo.** Un ejecutor que dice "verifiqué" no ha verificado nada desde el punto de vista
del sistema; la verificación existe cuando se puede mostrar contra el dato.

Y su límite, que es el mismo del resto del edificio: **el mentor no decide por ninguno de los dos.**
Cuestiona premisas, exige evidencia, nombra incoherencias — y devuelve la decisión a quien le
corresponde. Los humanos con licencia deciden.

Conviene decir por qué el rol existe como **rol** y no como buena intención. Tres disciplinas escritas
lo sostienen, y las tres nacieron de errores concretos:

- **Atacar la premisa compartida.** Cuando varios análisis convergen, el consenso no es señal de verdad
  — puede ser un punto ciego común. La disciplina es hacer explícita la premisa que todos asumen y
  verificarla contra el dato primario (ADR-037 Regla 5).
- **Separar conformidad de decisión.** Verificar que un entregable cumple la spec y decidir si el
  proyecto lo adopta son actos distintos, de manos distintas. El mentor hace el primero y **nunca** el
  segundo.
- **Verificar contra el estado real, no contra el reporte.** Ningún ejecutor —humano o AI— establece un
  hecho por afirmarlo.

*(La línea de autoridad y la regla de verificación están formalizadas en el documento de arquitectura de
orquestación del proyecto.)*

Cierra el mismo principio con el que abre todo: **el sistema captura, organiza y muestra su trabajo; los
humanos con licencia deciden.** Esa línea no se cruza por economía operativa, presión de volumen, ni
confianza acumulada en la herramienta.

---

# How to build a legal assistant that does not decide

### Design criteria of the T-Visa specialist

> *English rendering of the Spanish above. Where the two differ, the Spanish governs.*

---

## 1. Why it exists

> **To democratize access to quality, affordable legal evaluation and services for those who could not
> pay a serious firm.** — ADR-027

Four words carry the weight. **Democratize**: the client who matters by default is the one without
access today. **Evaluation and services**: not only acting, also analyzing — the system serves when
someone comes to find out what they have, even if they never retain. **Quality**: not degraded to be
cheap; democratization is pointless if the affordable version is worse. **Affordable**: not necessarily
free, but reachable for the underserved segment.

A distinction worth saying out loud because few do: **the commercial beachhead and the ultimate
beneficiary are not the same person.** Whoever pays first may be a boutique firm; who the product is
ultimately owed to is the underserved person. Collapsing the two is how a mission-driven project ends up
building only for whoever signs the check.

From that follows what we build and what we refuse. AI does **what is inherently AI** — operating over
the whole corpus at once, memory without fatigue, no ordering bias, no tribalism between practice areas.
AI does **not** do what is inherently human: empathy, rapport, social judgment, credibility assessment,
presence. When the machine absorbs the cold cognitive load, the lawyer is freed to be what the
underserved client most needs — someone who understands their story and walks with them over years. The
lawyer stops being primarily a *legal technician* and becomes a **super social worker** (ADR-027).

Hence the **explicit anti-features**, excluded by vocation rather than by regulation — and the
difference matters, because *regulation can be navigated with counsel and vocation cannot*:

- Voice agents feigning empathy or rapport with the end client.
- "Lie detection" or credibility scoring over client testimony.
- Predictors selling outcome certainty ("your case has a 73% chance").
- Agents that present themselves as human to the end client.

A list of prohibitions living only in a document defends nothing, so this one is a **review gate**: it
runs **before** code quality is examined, because if the filter fails the code does not matter yet. The
distinction organizing it is between **generative AI** — structuring, suggesting, summarizing,
extracting, identifying candidates for professional review: sound — and **predictive AI sold as
certainty** — "your case will win", "this client is lying", "this relief applies" with no human review:
structural snake oil. It also fixes how output is phrased: *"candidates to evaluate" yes; "qualifies for
X" no.*

And a closing question that is the most uncomfortable and the most useful:

> *If the end client understood exactly what this feature does, what data it uses, and its real error
> rate — would they use it with the same confidence?*

If the answer is "probably not", the feature **is being sold as better than it is**. That is snake oil
regardless of technical sophistication.

---

## 2. Non-adjudication as a constitutive principle

> **Analysis skills NEVER decide eligibility.** Their output is cognitive support for the paralegal and
> the attorney, not the system's adjudicative judgment. — the project's seventh principle

Everything else hangs from this. It is not a safety layer bolted on at the end; it is the shape of the
system.

The failure mode it prevents is **structural, not technological** — documented in aviation and medicine
as *automation bias*. When a system (with or without AI — it makes no difference) occupies the space of
human judgment, responsibility dissolves across layers. Each layer trusts the next. The result may be
deliberate fraud (the professional hides behind "the system approved it") or distributed negligence:
nobody decides wrongly, everyone trusts the prior layer, and the client ends up with a weak filing or a
retainer charged with no realistic path to approval.

In humanitarian visas the harm **always lands on the same side**: enforcement exposure, denials, money
spent by people who did not have it.

The triggering mechanism is mundane, which is why it is dangerous. A firm's real flow is
`intaker → junior QA paralegal → signing attorney`, and the attorney reviews at the speed of *"50
intakes in 5 minutes"*. **If the skill occupies the paralegal's cognitive space with a closed verdict,
the paralegal echoes it; if the paralegal echoes, the attorney signs on an echo.** The review chain
collapses without anyone doing anything wrong (ADR-032).

This is why disclaimers are not enough. Keeping conclusive labels behind strong warnings was explicitly
considered and rejected: *"disclaimers do not protect against automation bias… the junior paralegal
reads the label, not the disclaimer. **The word is the bias.**"* (ADR-032).

---

## 3. Evidence assessment, not verdict

The first version classified cases as `SELLS_HIGH`, `SELLS_WITH_CAVEATS`, `DOES_NOT_SELL`. That taxonomy
is **dead**, and the reason is more useful than the replacement.

### There were two gradients, not one

- **Factual gradient** — are the facts constituting the elements established in the intake? **This one
  belongs to the system.** It is verifiable against the form and the intake.
- **Adjudicative gradient** — given the facts, is the case A/B/C for the agency to approve? **Not the
  system's.** It belongs to the attorney, and it is **business risk appetite**: two competent attorneys
  grade the same intake differently. Some firms sell only A; others sell A/B/C.

Hence the deeper reason, stronger than the rule: **the skill cannot classify strength because strength
is not a property of the case.** It is a function of the attorney's lens. Any strength label the system
emits pretends to know a risk appetite that is not its own — and that pretended knowledge becomes a
shield ("the system approved it"), which is precisely the trap (ADR-034).

There was also a mechanical problem: the original seven categories were **a gradient disguised as
classes**. There is no objective boundary between "strong" and "partial". Asking a model to sort a
continuum into discrete classes makes it collapse toward the simplest category. No prompt refinement
fixes it: **the bug comes from the framework, not the model** (ADR-034).

### What the system emits

Four states per element, and **none is a conclusion about the case** (ADR-035):

| State | What it says | Action it triggers |
|---|---|---|
| `present` | Affirmative evidence captured in the intake. Does **not** mean legally satisfied or strong. | continue |
| `no_confirmado` | The intake did not capture enough. **Absence of evidence, NOT negative evidence.** | rescreening |
| `bright_line_no` | Dispositive negative answer to a concrete question. Requires `source_question` + `source_answer`. | close the vector |
| `no_aplica` | The vector does not belong to this case per the captured facts. | exclude the vector |

The sentence doing the most work in the whole system: **`no_confirmado` means "not captured", never
"does not qualify".** Given the false-negative profile in trafficking — fear, misunderstanding, not
remembering — silence does not prove something did not happen (ADR-034).

Three form rules sustain that (ADR-035): **`basis` is mandatory for every state** (no anchor to concrete
questions or facts, no state — the model cannot assert without showing where it read it);
**`bright_line_no` requires structured `source_question` + `source_answer`**, not buried in prose,
because closing a vector is the most consequential act the system performs and therefore leaves the most
trace; and **any strength state is forbidden** (`partial`, `weak`, `strong`, `likely`) — observable
weakness is described in prose for the attorney, never as a field.

One property is baked into the geometry: **under ambiguity the residual is `no_confirmado` → ask again,
never `bright_line_no` → close.** The conservative failure mode is not an instruction the model can
forget; it is the shape of the state space.

"Elements complete" does not mean "sells" either. It means the facts are in the intake. If the attorney
proceeds, **the legal reframe lives in the filing** — declaration and cover letter — not in the intake
and not in the skill (ADR-034).

---

## 4. Cognitive support that concentrates human judgment

The design question is not *"how much can the machine decide?"* but *"where does the human need to be
looking?"*. A system that decides little but **concentrates the attorney's attention on the three things
only they can resolve** is worth more than one that decides a lot and leaves them reviewing noise.

The analysis engine is designed as a **chain of Socratic filters, not a decision pipeline** (ADR-032):
the intake recommender pushes the intaker to re-capture what is missing; the specialist pushes the
paralegal to rescreen or rethink before escalating; the attorney's signature is the close. **No layer
closes the judgment of the next. Each feeds the next one's input.**

Concretely, every doubt routes to one of three destinations:

| What surfaces | Where it goes | Why |
|---|---|---|
| **A gap** — the intake did not capture the fact | → **a question** (rescreening) | `no_confirmado` has exactly one funnel action: ask again (ADR-035) |
| **A generalizable boundary** — the same threshold recurs case after case | → **a rule signed** by a licensed human | Dispositive authority can only exist where the rule is human, explicit and auditable (ADR-035); the rule is modeled with `approved_by`, `rationale`, `effective_date` (ADR-036) |
| **A particular boundary** — this case, this threshold, this risk appetite | → **the attorney** | That is the adjudicative gradient, which is not the system's (ADR-034) |

> The *promotion criterion* — when a boundary is generalizable enough to become a signed rule — is an
> **open criterion: it gets defined through practice**, not a threshold baked in ahead of time. The
> funnel above is faithful to its sources across all three destinations; the middle row's threshold
> gets fixed case by case, under a licensed attorney's authority, rather than pretending one already
> exists.

The real gain: the attorney stops spending attention *finding* what is missing and spends it *deciding*
what only they can decide.

There is an ethical limit on the same boundary. The system pursues **what the client is willing to
disclose under competent, honest questioning — not material truth**. We do not invent, exaggerate, lead
or push. Faced with competent denial across all vectors, the analysis closes, even knowing a
fear-driven false negative is possible. The alternative — pushing to extract testimony — produces the
harm that matters most to avoid in trafficking: induced testimony, re-victimization, and a case that
collapses before the adjudicator. **Competent denial is the floor of the system: an honest pass, not a
loop** (ADR-034).

---

## 5. Anti-gradient: what can be a table, is a table

An engineering principle that turned out to be an ethical one.

Every time a language model is asked to resolve something that **could have been a structure**, two bad
things happen at once: the result becomes unstable — models collapse continua toward the simplest
category — and the decision becomes **opaque**, because it lives inside the model instead of being
written where someone can argue with it.

The operative criterion is **operational monotonicity**: *a category exists if and only if it triggers a
distinct action*. It is a stronger test than any semantic argument. `partial` died by it: sometimes it
meant "ask more", sometimes "let the attorney look", sometimes "just a note" — no action of its own, so
not a category (ADR-035).

The sharpest architectural consequence is how model and rules are separated (ADR-036):

- **The specialist does NOT consult rules.** It emits the state with its `basis`, `source_question` and
  `source_answer` — a factual event about the intake.
- **The engine** — a separate layer — checks whether any human rule matches that `(question, answer)`
  and applies what that rule authorizes.

The model does not know which rules exist. That decoupling lets the same specialist serve firms with
different doctrines and — more importantly — **keeps dispositive authority outside the language model**,
in a human, auditable entity.

Same principle in retrieval: the agent **does not guess where to look**. A deterministic map binds each
trigger to its exact source, and *"an alias not in the table is not a route"*. If a trigger has no row,
the answer is not to improvise a source — it is to declare the hole.

In one line: **the LLM reads what cannot be structure; everything else is a table.**

The corollary is that the structure must be built **for error, not for success**. Every AI output carries
undo, override (hand-editing), and "mark as incorrect" — and that correction signal **is persisted and
feeds the evals**. The review rule is explicit: if the answer to any of those is *"not needed, the output
is good"*, stop. **The output will fail; the only question is when, and how the human corrects it.** A
system with nowhere to record its own error is not trustworthy — merely silent.

---

## 6. Authority hierarchy and fidelity to the source

A legal system that cites badly is worse than one that does not cite.

Doctrinal claims are anchored in an explicit **authority hierarchy** — statute, regulation, agency
policy, case law — and the level **travels with the citation**: a district ruling and a statute do not
weigh the same, and the output must not flatten them.

### The hierarchy is a choice, and we show ours

Here it is better to be transparent than to decree. **There is no single correct hierarchy we can hand
over pre-packaged**: the ordering depends on what it is used for, and every firm — every responsible
attorney — will have to **make it their own**. We chose ours and we put it in plain view, which is the
only honest thing to do with a decision that is not universal.

Our choice is **two orderings for two different questions**, and conflating them is the error worth
avoiding:

| The question | The ordering we use | Why |
|---|---|---|
| **What governs as law?** (legal authority) | statute → regulation → case law → agency policy | This is the hierarchy of legal sources. A policy manual does not outrank a court (ADR-034) |
| **How will the adjudicator resolve this?** (the agent's consultation order) | statute → regulation → **agency policy** → persuasive case law | The agent assesses **how the agency would adjudicate**; its policy manual governs the adjudicator even where it does not govern a court. Cases **persuade, they do not command** (decision of 2026-08-19) |

The difference is not an inconsistency: **"what is more authoritative" and "what better predicts the
decision we are anticipating" are different questions**, and a system that collapses them will cite well
and predict badly, or the reverse.

This is why the package is designed so that **the choice is configurable, not baked in**. It is the same
logic that keeps dispositive rules outside the model (§5): if each firm's doctrine lives in human,
auditable entities, its consultation hierarchy should be able to live there too. A firm with a different
appetite, jurisdiction, or forum must be able to order its sources differently **without touching the
engine** — and without silently inheriting someone else's choice.

Two disciplines sustain fidelity, and both were born from real errors:

**Verbatim against the raw source, not against the summary.** A central premise of the framework — that
a certain harm was a categorical exclusion — turned out to be a **misreading of the source itself**: the
real text said *"generally… solely… totality"*, and the hardened reading had dropped those three words.
The closure fell not by hierarchy but by reading the original. Hence: **verbatim over paraphrase in any
source that sustains a closure** (ADR-038). With an uncomfortable corollary: such a correction is
**retroactive** — every prior case that leaned on the corrected reading gets re-reviewed, not only the
one that surfaced it.

**Hierarchy is an instrument for conflict, not a default explanation.** When two levels agree, what
resolves is the agreement, not the outranking (ADR-038).

To which add the real failure mode of legal RAG, which is not the one usually named: **it is not the
fabricated citation** — a verified corpus covers that — **but the real citation attached to a provision
that has since changed**. The antidote is treating currency as a first-class field (`effective_date`),
not an assumption (ADR-036).

---

## 7. The method

The construction method is part of the product. A system whose thesis is "leave a trace" cannot be built
without leaving one.

**Auditability over perfection** — not because correctness does not matter, but as a hierarchy when the
two compete: between a system that looks more certain but is opaque, and one that admits its uncertainty
but is traceable, choose the second. *"Perfection is a property one claims; auditability is one that is
offered. Perfection asks the other to trust; auditability gives them the means to verify and, if
needed, to contradict."* With its own caveat: the principle holds when auditability *competes* with
perfection, never when it *replaces* it.

**Partial objectivity.** Human domains are interpretable by nature, and that is not a defect to be
repaired with more formalization. But interpretable is not relativist: there are sound readings and
untenable ones. Both alternatives would destroy the project — hard objectivism would have the system
decide (violating the seventh principle); relativism would make auditing pointless. The project lives in
between, and that is *"the most demanding of the three postures"*.

**Authority comes from the evidence you can show, not the position you occupy.** It applies to the
specialist, the rule, the attorney — and to the exam. When the eval and the case collide, **neither
retains a presumption of correctness**: you open the case and the evidence decides. The presumption is
not lost automatically; it is lost **through work** (ADR-037). And every ground-truth correction carries
the same auditable authorship the system demands of a closure — *"without that trace, 'we audited the
ground truth' becomes a euphemism for 'we adjusted the exam'"*.

**Consensus is not a signal of truth.** Three independent analyses once converged on the same wrong
diagnosis because all three shared a hidden premise. The antidote is not a smarter analysis — it is
going to the **raw data** that would prove or break the premise everyone assumes (ADR-037).

### The AI mentor

This role was not designed in the abstract: **it was practiced first, formalized later, and named last.**

It began as a working practice in May 2026 — **dialectical** sessions where two different models acted
as **counterweights in turns**, with the founder as the human filter. The rule that emerged is the one
holding up everything else: **reinforce the dialectical dynamic with a human filter, not mutual
validation between AIs.** Two models agreeing with each other do not produce truth; they produce a blind
spot with two witnesses.

That practice was formalized as an **orchestration role** with an explicit authority line — who verifies
conformity and who decides — and the founder now gives it a name: **the AI mentor**.

It is a third role sitting above both the human and the executing AI, whose function is neither to
produce work nor to approve it, but to **interrogate both sides with epistemological and logical
rigor**.

- **To the human**: where does that premise come from? is it coherent with what you signed before? does
  that citation say what you say it says?
- **To the executing AI**: does this meet the spec or merely look like it? is this evidence, or your
  report that evidence exists?

The operative distinction that makes the role useful: **verify against the source, not against the
report of whoever did the work.** An executor saying "I verified" has, from the system's standpoint,
verified nothing; verification exists when it can be shown against the data.

Three written disciplines hold the role up, and all three were born from concrete errors: **attack the
shared premise** (when analyses converge, consensus may be a common blind spot — make the assumed
premise explicit and check it against primary data, ADR-037); **separate conformity from decision** (the
mentor does the first and **never** the second); and **verify against real state, not against the
report** (no executor, human or AI, establishes a fact by asserting it).

And its limit, the same as the rest of the building: **the mentor decides for neither of them.** It
questions premises, demands evidence, names incoherences — and returns the decision to whoever owns it.
Licensed humans decide.

It closes on the principle it opens with: **the system captures, organizes, and shows its work; licensed
humans decide.** That line is not crossed for operational economy, volume pressure, or accumulated trust
in the tool.

