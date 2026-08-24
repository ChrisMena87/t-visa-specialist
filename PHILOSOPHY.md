**Español** · [English](./PHILOSOPHY.en.md)

# Cómo se construye un asistente legal que no decide

### Criterios de diseño del T-Visa specialist

> [!CAUTION]
> **Este software no sustituye el consejo de un abogado.** Es un laboratorio experimental: no está
> en producción, no se ha utilizado para evaluar ningún caso de ningún cliente, y ninguna decisión
> legal o comercial se ha tomado a partir de esta herramienta. Uso previsto: bajo supervisión de
> abogados con licencia. Ver el aviso completo en el [README](./README.md).

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
