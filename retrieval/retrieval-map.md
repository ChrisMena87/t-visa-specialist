---
documento: "retrieval/retrieval-map.md — mapa determinístico disparador → fuente (agente Visa T)"
version: "v1 (APROBADO por el director 2026-08-19 — gate de lectura entera)"
fecha: 2026-08-19
estado: "VIVO. APROBADO en el gate de lectura entera del director (2026-08-19), con dos resoluciones registradas en §10 (Hardship: puerta cerrada · jerarquía: PM sobre case-law). Artefacto NUEVO — antes el retrieval vivía sólo en la cabeza de quien escribió el prompt."
que_es: >
  El mapa "dónde busco qué" del agente Visa T: tema / pregunta / disparador → archivo exacto dentro del
  paquete. Hace el retrieval AUDITABLE (se ve de dónde sale cada afirmación) y es el esqueleto del
  routing determinístico que el límite conocido del rebuild pide (bright_line_no estocástico).
regla: >
  El mapa DESCRIBE dónde mirar. No adjudica, no asigna estados, no pesa suficiencia (7º principio del
  proyecto). Consultar una fuente NUNCA cambia un estado por sí solo: los estados se asignan por
  las reglas de prompt/reasoning.md §1 (R1 ancla textual · R2 NO dispositivo · R3 no juzgar lo no
  preguntado · R4 cascada moot).
convencion_de_rutas: >
  Toda ruta se cita por su ALIAS de §2.1, que la liga a una ruta exacta relativa a la raíz del repo. No hay
  rutas implícitas: un alias no definido en §2.1 no es una ruta. Los números de línea fueron verificados
  contra el filesystem al 2026-08-19 (§10.7). Las líneas del 06 son del CUERPO del documento (su
  frontmatter YAML ocupa L1-315; el cuerpo abre en L317).
---

# Mapa determinístico de retrieval — agente Visa T

---

## §0 — Qué es y qué NO es

**Es** una tabla de ruteo. Dado un tema, una pregunta de juicio o un disparador del intake, dice **qué
archivo del paquete lo resuelve** y **en qué orden de autoridad**. El agente **nunca adivina dónde
mirar**.

**NO es:**

- **No es doctrina.** No define umbrales ni resuelve fronteras. Las fronteras firmadas viven en el `06`;
  el mapa sólo dice **dónde** está cada una.
- **No es adjudicación.** Ninguna fila autoriza a concluir que un elemento está satisfecho, que el caso
  vende, o que el cliente califica. Eso es del humano con licencia (7º principio;
  `RSN` §0).
- **No es un calibrador de estados.** Encontrar una fuente que "suena parecida" al caso no sube ni baja
  un estado. El estado lo fija **sólo la evidencia anclada al intake** (`RSN` §1).

---

## §1 — Protocolo de consulta (los cuatro pasos, en orden)

1. **Identificá el elemento** al que pertenece la duda (Acto · Medios · Fin · Presencia · Cooperación ·
   Hardship). Entrada: **§3**.
2. **Preguntá si la duda es de CAPTURA o de FRONTERA.**
   - *Captura* ("¿el intake registró el hecho?") → **§5** (disparadores) y **§8** (las dos formas del
     intake). El resultado es un estado por `RSN` §1, o un gap por `RSN` §4.
   - *Frontera* ("¿este hecho alcanza el umbral?") → **§4** (rutas por frontera firmada). El resultado
     **no es un estado**: es material para el juicio del abogado.
3. **Recorré la ruta en orden de autoridad** (§2). Parás en el primer nivel que responde. No saltes al
   case-law antes de agotar estatuto → regulación → Policy Manual → `06`.
4. **Si la duda es de juicio y persiste**, recién ahí consultá case-law (**§6** federal, **§7** AAO) como
   **recurso persuasivo invocable** — nunca como capa que calibre el umbral por default
   (`SK-CL`).

### Tres reglas duras del mapa

- **REGLA A — sin fila, no hay improvisación.** Si un disparador no tiene fila en este mapa, **no se
  inventa la fuente**. Se trata como lo que es: una duda sin percha de canon → gap declarado
  (`no_confirmado`) y/o escalación. Un ruteo inventado es peor que un ruteo ausente, porque parece
  auditado.
- **REGLA B — la fuente no cierra el vector.** Ninguna consulta produce `bright_line_no`. El
  `bright_line_no` viene **sólo** de una pregunta SI/NO dispositiva del cuestionario contestada NO, con
  `source_question` / `source_answer` citados (`RSN` §1 R2; `CTR` §2.1).
- **REGLA C — el nivel de autoridad viaja con la cita.** Al citar, se dice de qué nivel sale (§2). Un
  fallo de distrito y el estatuto no pesan igual, y el output no debe aplanarlos.

---

## §2 — Jerarquía de autoridad (el orden del recorrido)

| Orden | Nivel | Qué es | Alias del paquete |
|---|---|---|---|
| 1.º | **Estatuto** (`nivel_autoridad: 1`) | Ley del Congreso. Manda. | `INA-T` · `TVPA` · `SMUG` |
| 2.º | **Regulación** (`nivel_autoridad: 3`) | 8 CFR 214 subpart C, post-Final Rule 2024. | `CFR-C` · `FR-2024` |
| 3.º | **Policy Manual** (Nivel 5 según el `06`, L1494) | Política vinculante para el adjudicador de USCIS, no para cortes. | `PM-B` |
| 4.º | **Doctrina del proyecto** | El `06` y sus matrices: **no es canon** — es la lectura firmada del abogado sobre el canon. Se cita como decisión del proyecto, nunca como autoridad legal. | `06` · `04` · `05` |
| 5.º | **Case-law persuasivo** (`nivel_autoridad: 4` federal / **Nivel 7** AAO) | Informa el juicio del abogado. No lo reemplaza, no sube ni baja un estado. | `CL-FED/` · `CL-AAO/` · `APX-PM` |

**El orden de arriba es el del mapa, por decisión del director (2026-08-19):** el **Policy Manual va por
encima del case-law**, porque el agente evalúa **cómo adjudicaría USCIS** — los casos **persuaden, no
mandan**. Ver §10 obs. 1.

**Caveat de escala, declarado (reconciliación pendiente, fuera de este mapa).** Las 25 fichas federales llevan todas
`nivel_autoridad: 4` **plano** — SCOTUS (Bailey, Clyatt, Pollock, Reynolds, Kozminski) comparte tier con
órdenes de distrito no publicadas (Fatty), y ese `4` queda **por debajo** del Nivel 5 del PM, al revés del
orden que el director fijó para el mapa. Las fichas mismas marcan la tensión como pendiente en la KB.
Consecuencia operativa: **el tier de la ficha no gobierna el recorrido — gobierna esta tabla**; el tier no
distingue vinculante de persuasivo, y `RSN` §6 fija el default (case-law del paquete = **persuasivo**).
**Reconciliar las etiquetas queda pendiente como trabajo futuro**; este mapa no toca metadata del corpus. Ver §10 obs. 1-2.

### §2.1 — Alias de ruta (el binding: alias → ruta exacta)

Todas las rutas relativas a la raíz del repo. **Un alias que no esté en esta tabla no es una ruta.**

| Alias | Ruta exacta | Qué es |
|---|---|---|
| `INA-T` | `corpus/references/statute/8-usc-1101-a-15-T-nonimmigrant.md` | 8 USC 1101(a)(15)(T) — los cuatro elementos INA |
| `TVPA` | `corpus/references/statute/22-usc-7102-tvpa-definitions.md` | 22 USC 7102 — definiciones TVPA |
| `SMUG` | `corpus/references/statute/8-usc-1324-bringing-in-harboring.md` | 8 USC 1324 — smuggling (contraste, no elemento de T) |
| `CFR-C` | `corpus/references/regulations/8-cfr-214-subpart-c-t-nonimmigrant-status.md` | 8 CFR 214 subpart C — §§214.200-214.216 |
| `FR-2024` | `corpus/references/regulations/T-Visa Final Rule.md` | Final Rule 89 FR 34864 (vig. 28-ago-2024) — preámbulo + texto codificado |
| `PM-B` | `corpus/manual/part-b-victims-of-trafficking.md` | **3 USCIS-PM B** — Victims of Trafficking |
| `06` | `corpus/doctrine/06-evaluation-framework-v0.1.md` | Evaluation framework — las fronteras firmadas |
| `04` | `corpus/doctrine/04-tvpa-element-matrix-v1.md` | Matriz TVPA (Acto/Medios/Fin) — autoridad de cada celda del `06` |
| `05` | `corpus/doctrine/05-eligibility-extra-elements-v1.md` | Elementos INA extra (Presencia/Cooperación/Hardship) — ídem |
| `MOD-H` | `corpus/capture/modulo-t-preguntas-v0.md` | Módulo nuevo — inventario de h-codes |
| `FORM-Q` | `corpus/capture/TEMPLATE INTAKE 6.3.1.md` | Formulario viejo — Q-numbers por silo |
| `MAN-INT` | `corpus/capture/manual-visa-t-v0.md` | Manual del intaker — doctrina en cristiano |
| `APX-PM` | `corpus/case-law/appendix-pm.md` | Apéndice de case-law del Policy Manual (3 USCIS-PM B) |
| `CL-FED/` | `corpus/case-law/federal/` | Carpeta — 25 fichas federales/publicadas |
| `CL-AAO/` | `corpus/case-law/aao/` | Carpeta — 10 decisiones AAO + 4 de metadata |
| `AAO-IDX` | `corpus/case-law/aao/_index.md` | Índice de ruteo del corpus AAO (primer salto de §7) |
| `RSN` | `prompt/reasoning.md` | Artefacto A — razonamiento del prompt vivo |
| `CTR` | `prompt/contract.md` | Artefacto B — contrato de output |
| `SK-CL` | `skills/case-law-invocation.md` | Skill — cuándo/cómo invocar case-law |
| `SK-RS` | `skills/rescreening-banks.md` | Skill — bancos de rescreening + gap ejecución/diseño |
| `SK-FORM` | `skills/read-intake-forms.md` | Skill — leer las dos formas de intake |

**Los nombres de caso en prosa** (§4, §5 — "Kozminski", "Calimlim") **se resuelven en §6/§7**, que son las
únicas tablas que ligan caso → ficha.

---

## §3 — Ruta base por elemento (la espina)

Un renglón por elemento del contrato (`CTR` §2.6). Se lee de izquierda a derecha: es el orden del
recorrido de §1 paso 3.

| Elemento | 1.º Estatuto | 2.º Regulación | 3.º Policy Manual | 4.º Celda del `06` | Captura |
|---|---|---|---|---|---|
| **Acto** | `TVPA` (11) L71 | `CFR-C` §214.201 L21 | `PM-B` §B.1 L141 · §B.2 harboring L180 · §B.3 scheme/pattern/plan L246 | `06` §Acto L434-471 + sub-elementos L474-668 | `MOD-H` h1-h4 |
| **Medios** | `TVPA` (3) coerción L20 · (1) abuse of legal process L16 | `CFR-C` §214.201 L21 | `PM-B` §B.3 L195-288 (threats L203 · restraint L225 · analizar amenazas L238 · abuse of legal process L275) | `06` §Medios L669-702 + Force/Fraud/Coercion L703-803 | `MOD-H` h8-h18, h20 |
| **Fin** | `TVPA` (11) L71 · (8) IS L52 · (7) debt bondage L50 · (4) commercial sex act L25 · (11)(A) gate del menor L73 | `CFR-C` §214.201 L21 | `PM-B` §B.4 L289-348 (IS L291 · servidumbre en DV L308) · §B.5 sexo L349 · §B.6 principios L353-388 · §B.7 smuggling L389 | `06` §Fin L804-833 + sub-elementos L834-1097 | `MOD-H` h5-h7, h15, h19, h22 |
| **Presencia** | `INA-T` (T)(i)(II) L18 | `CFR-C` §214.207 L313 — base (a)(1)-(5) L317-325 · post-salida (b)(1)-(5) L333-341 · evidencia (c) L343 | `PM-B` §C.1 L411 (nexo directo L440) · §C.2 salidas L482-530 | `06` §Presencia L1098-1240 (desaplanamiento L1117) | gap de DISEÑO — el form viejo no tiene el nexo |
| **Cooperación** | `INA-T` (T)(i)(III) L19 | `CFR-C` §214.208 L373 — razonabilidad (c) L379 · excepción/exención (e) L419 | `PM-B` §D L532-621 (regla general L534 · totalidad L553 · comparably-situated L575 · contacto L581 · edad+trauma L604) | `06` §Cooperación L1241-1384 | `MOD-H` h21 (edad-al-evento) |
| **Hardship** | `INA-T` (T)(i)(IV) L22 | `CFR-C` §214.209 L447 — estándar (a) L451 · nueve factores (b)(1)-(9) L455-471 · evidencia (c) L473 | `PM-B` §E L622-658 (regla general L624 · factores L628, lista de victimización L643-656) | `06` §Hardship L1385-1602 (`#H1` cierre firmado L1528) | gap de DISEÑO total — el form viejo no lo pregunta |

**Nota de precedencia dentro de la ruta de Hardship.** El estándar aplicable es el **AUTÓNOMO de
§214.209(a)** — nueve factores en totalidad (`#H1` FIRMADO, `06` L1536-1539). La doctrina **general** de
extreme hardship **NO se importa**: son umbrales distintos y mezclarlos re-aplana. Por eso el 9 USCIS-PM B
del paquete **no** entra en esta ruta — ver §9.

---

## §4 — Rutas por frontera firmada (los tokens del `06`)

Las 22 fronteras firmadas + los grupos resueltos. **Todas son fronteras de JUICIO: su salida alimenta al
abogado, no al estado.** El `06` es la percha de la decisión firmada; el canon es su fundamento.

| Token | Qué frontera es | Percha en el `06` | Fundamento en canon | Case-law de consulta (§6/§7) |
|---|---|---|---|---|
| `#D0` | Términos sin definición autónoma (6 verbos-acto + Force/Fraud) → sentido ordinario / importación | L417-431 | `CFR-C` §214.201 L21; ADR-039 | — |
| `#C1` | Cascada inter-elemento (dos motores: el estructural casca sólo ante `bright_line_no`; el de eficiencia NO es automático) | L374-409 | `INA-T` (T)(i)(I)-(IV) L17-22; `TVPA` (11) L71 | — |
| `#A1` | El path (labor vs sexo) se **deriva del Fin**, no de hipótesis del intaker | L455 | `TVPA` (11) L71 | — |
| `#A6` / `#A7` | Harboring: umbral de "substantially" + **sin dispositiva limpia** (control → FRONTERA/GAP, no cierre) | §Harboring L500-544 | `PM-B` §B.2 L180-193 | — |
| `#M9` / `#M10` | Coerción: umbral por modalidad + abuse of legal process; **sin dispositiva limpia** | §Coercion L751-803 | `TVPA` (3) L20 · (1) L16; `PM-B` §B.3 L195-288 | Kozminski · Calimlim · Veerapol · Farrell · Djoumessi · Ruiz · Nunag-Tanedo · Elat · Kaufman |
| `#F2` / `#F3` | Involuntary servitude: umbral **DV** de "condition of servitude" (vara `PM-B` §B.4) | §Involuntary Servitude L834-941 | `TVPA` (8) L52; `PM-B` §B.4 L289-348 | Dann · Warren · Bradley · Udeozor · Djoumessi |
| `#F2b` | Frontera **smuggling → servidumbre** (rama laboral; test `PM-B` §B.7) | §Involuntary Servitude L834-941 | `PM-B` §B.7 L389-403; `SMUG` (contraste) | AAO 23981595 · AAO 35887018 |
| `#F2c` | Frontera **smuggling → trata sexual** (rama sexual; hereda `#F2b`) | §Frontera operacional smuggling → trata sexual L1084-1097 | `PM-B` §B.7 L389-403 + §B.5 L349 | AAO 7360790 |
| `#F4` / `#F5` | Debt bondage: **"reasonably assessed"** = frontera del abogado | §Debt Bondage L942-982 | `TVPA` (7) L50; `CFR-C` §214.201 L21 | Farrell (única ficha del apéndice bajo *Debt bondage*) · AAO 13039037 |
| `#F6` / `#F7` | Peonage: distinción con contrato voluntario en DV; va **por separado** de `#F4` | §Peonage L983-1038 | `TVPA` (7) L50; `PM-B` §B.4 L289-348 | Reynolds · Clyatt · Bailey · Pollock · Farrell |
| `#F8`-`#F11` | Slavery — **COLAPSADO en `#F2`** (agravante de IS, no fin autónomo). Sin checklist propio | §Slavery L1039-1059 | *(sin definición vinculante en ningún nivel — razón del colapso)* | *(se evalúa con la vara de `#F2`)* |
| `#F12` / `#F13` | Commercial sex act: umbral de **"anything of value"** (lista abierta) | §Commercial Sex Act L1060-1097 | `TVPA` (4) L25 · (11)(A) L73; `FR-2024` L523 ("including but not limited to") | AAO 5845586 · AAO 10892507 · AAO 7360790 |
| `#P1` | Nexo **"directly related"** de la presencia base, vía (a)(4). En DV casi nunca llega limpio → FRONTERA | §Presencia L1098-1240 | `CFR-C` §214.207(a)(4) L323; `PM-B` §C.1 nexo directo L440-481 | AAO 17756724 |
| `#P2` | **NO se agrega dispositiva**: las 10 vías + presencia física al filing agotan las dispositivas | §Presencia L1098-1240 | `CFR-C` §214.207(a)(1)-(5) L317-325 + (b)(1)-(5) L333-341 | — |
| `#P3` | **"cannot be provided"** — no-disponibilidad de tratamiento, **SÓLO Presencia (b)(5)**. Bisagra: *related to their victimization* | §Presencia L1098-1240 | `CFR-C` §214.207(b)(5) L341; `PM-B` §C.2 L528-531 | — |
| `#P4` | **Continued victimization en el reingreso** (b)(1). Vara adoptada: `PM-B` «Reentry Due to Continued Victimization» + 3 factores | §Presencia L1098-1240 | `CFR-C` §214.207(b)(1) L333; `PM-B` L499-511 (factores L509-511) | AAO 22819771 |
| `#C2` | Excepción por **trauma**: vara = lista (i)-(x); la suficiencia de la documentación es juicio | §Cooperación vía (c) L1330-1351 | `CFR-C` §214.208(e)(1) L421-441; `PM-B` §D.5 L604-609 | — |
| `#C3` | Las tres vías de Cooperación se evalúan **en PARALELO** (OR, invariante al orden) | §Cooperación L1241-1384 | `CFR-C` §214.208 L373-445 | — |
| `#C4` | **Exención por edad <18** al momento de la victimización (bright-line de edad; cierra Cooperación por sí sola) | §Cooperación vía (b) L1297-1329 | `CFR-C` §214.208(e)(2) L443; `PM-B` §D.5 L604-609 | — |
| `#H1` | **Totalidad** "unusual and severe" bajo el estándar **AUTÓNOMO** de §214.209(a). No se importa doctrina general | §`#H1` — Cierre firmado L1528-1587 | `CFR-C` §214.209(a) L451 + (b)(1)-(9) L455-471; `PM-B` §E L622-658; `FR-2024` L988 | AAO 10106816 · AAO 11297648 |
| `#H2` | **NO hay dispositiva limpia** salvo "cero factores de §214.209(b) articulados" | §Hardship L1385-1602 | `CFR-C` §214.209(b) L453-471 | — |
| `#H3` | **Totality, no scoring** (doctrina) + **captura discreta** de los nueve factores (operación) | L1399-1432 | `CFR-C` §214.209(a) L451; `PM-B` §E.1 L624-626 | — |
| `#H5` | **"not reasonably available"** — care en Hardship (b)(2). **NO** requiere *related to victimization* (a diferencia de `#P3`) | Tabla de desaplanamiento, fila (2) L1475 | `CFR-C` §214.209(b)(2) L457; `PM-B` §E.2 L646 | AAO 10106816 |
| `#H6` | **Atribución del daño a la trata** (b)(3): umbral de atribución explícita / clínicamente sostenible | Bloque `#H6` L1433-1447 + fila L1476 | `CFR-C` §214.209(b)(3) L459 (verbatim citado en `06` L1444); `PM-B` §E.2 L647 | AAO 17756724 · AAO 22819771 |

### Dos pares que el mapa existe para NO confundir

| Confusión | Ruta A | Ruta B | Por qué importan separadas |
|---|---|---|---|
| **"El tratamiento no existe en su país"** | `#P3` — Presencia (b)(5), `CFR-C` L341. Umbral: *cannot be provided*. **Exige** nexo *related to their victimization* | `#H5` — Hardship (b)(2), `CFR-C` L457. Umbral: *not reasonably available*. **NO** exige nexo con la trata | El abogado **separó los umbrales el 2026-07-04** (antes eran reuso 2-por-1). Rutear al archivo equivocado importa el nexo que el otro no pide (`06` L1515-1519) |
| **"Era menor de 18"** | **Gate del menor en trata sexual** — `TVPA` (11)(A) L73: con sexo comercial, **Medios se cumple por la edad**, sin probar fuerza/fraude/coerción | **Exención de Cooperación `#C4`** — `CFR-C` §214.208(e)(2) L443: <18 al momento de la victimización exime del requisito de cooperar | Son **dos elementos distintos**. La edad no hace las dos cosas a la vez ni por la misma vía |

---

## §5 — Rutas por disparador del intake

Disparadores tal como aparecen en un intake real. Entrada rápida cuando la duda no viene rotulada por
elemento.

| Disparador en el intake | Elemento | Ruta primaria | Frontera / regla que aplica |
|---|---|---|---|
| "Había armas / el patrón exhibió un arma" | Medios | `PM-B` §B.3 L203-244 | **Display-de-armas ≠ amenaza-para-forzar.** La pregunta que decide es si amenazó con ella para que no se fuera. Si no se hizo → `no_confirmado` (`RSN` §1 R3) |
| "Amenazó con llamar a migración / la policía / CPS" | Medios | `PM-B` *Abuse or Threatened Abuse of the Legal Process* L275-288; `TVPA` (1) L16 | `#M9`/`#M10`. Case-law nutrido: Kozminski · Calimlim · Veerapol · Farrell · Djoumessi · Ruiz · Nunag-Tanedo · Elat |
| "Le retuvieron el pasaporte / los documentos" | Medios | `PM-B` §B.3 L195-288 | `#M9`/`#M10` (`MOD-H` h17). Calimlim (pasaporte + advertencias vagas = esquema de coerción) |
| "Amenazó con dañar a su familia" | Medios | `PM-B` §B.3 L203-224 | `#M9`/`#M10`. Amenaza a terceros cuenta como amenaza directa |
| "Lo tenían encerrado con llave / no podía salir" | Fin | `PM-B` §B.4 IS L291-307; `TVPA` (8) L52 | `#F2`. Restricción física es dispositiva de servidumbre; el escape posterior no la borra |
| "La deuda no bajaba / no le dijeron cuánto ni hasta cuándo" | Fin | `TVPA` (7) L50; `CFR-C` §214.201 L21 | `#F4` — los dos disyuntos (`MOD-H` h15c / h15d). *"Reasonably assessed"* es juicio del abogado, no del análisis |
| "Vino con coyotes y lo hicieron trabajar" | Fin | `PM-B` §B.7 L389-403 + servidumbre en arreglo de smuggling L328-330 | `#F2b`. AAO 23981595 (propósito separado) · AAO 35887018 (singled out / excede el arreglo) |
| "Un coyote la separó del grupo y le exigió sexo" | Fin | `PM-B` §B.7 L389-403 + §B.5 L349-352 | `#F2c` + `#F12`/`#F13`. AAO 7360790 (el servicio de smuggling **es** "algo de valor") |
| "El jefe condicionó el empleo / la vivienda a tener sexo" | Fin | `TVPA` (4) L25; `FR-2024` L523 | `#F12`/`#F13`. AAO 5845586 (quid-pro-quo articulado) vs AAO 10892507 (sin articulación → acoso sexual, **otro lane**) |
| "Un familiar controlaba sus ingresos" | Acto/Medios/Fin | `PM-B` §B.3 L203-244 + §B.4 L289-348 | Banco *labor trafficking by parent* (`RSN` §4). AAO 17756724 |
| "El sponsor amenazó con cancelarle la visa" | Medios | `PM-B` *Abuse of Legal Process* L275-288 | Banco *control de visa*. AAO 11297648 (F-1/DSO) · AAO 10106816 (H-1B) |
| "Le pagaron algo, entonces no fue forzado" | Fin | `PM-B` §B.6 *Compensation is Not Determinative* L359-364 | La compensación **no** es determinativa. Bradley |
| "El trabajo no era económico (desnudez, actos sexuales, tareas raras)" | Fin | `PM-B` §B.6 *Non-Traditional Types of Work* L365-372 | Kaufman · Marcus |
| "Fue poco tiempo / unas horas" | Acto/Fin | `PM-B` §B.6 *No Defined Length of Time Required* L373-388 | La duración corta cuenta. Pipkins · Dann · Djoumessi |
| "Pudo escapar / se fue después" | Fin | `PM-B` §B.4 L291-307 | El escape posterior no borra el hecho. Warren · Djoumessi |
| "Lo albergaron pero sin explotarlo" | Acto | `PM-B` §B.2 L180-193 | `#A6`/`#A7`. **Harboring exige propósito de explotación** — convivencia / retención por extorsión / smuggling-retention no bastan |
| "Sigue en EE.UU. / no se fue" | Presencia | `CFR-C` §214.207(a) L315-329; `PM-B` §C.1 L440-481 | `#P1`. Estar acá es el **hecho base, no el nexo**. Sin vía capturada → `no_confirmado` (gap de DISEÑO) |
| "Hay un reporte policial de otro delito" | Presencia / Cooperación | `CFR-C` §214.207(a) L315-329 · §214.208 L373-445 | **No es** presencia-a-causa-de-la-trata **ni** cooperación-sobre-la-trata. Puede fundar U-visa → **flag de referido** (`RSN` §0 R3) |
| "Salió del país y volvió" | Presencia | `CFR-C` §214.207(b)(1)-(5) L333-341; `PM-B` §C.2 L482-531 | Las cinco vías post-salida. Si el motivo fue victimización continuada → `#P4` (vara `PM-B` L499-511) · AAO 22819771 |
| "No reportó a la policía" | Cooperación | `CFR-C` §214.208 L373-445 | Las tres vías corren **en paralelo** (`#C3`): cumplió pedidos · <18 (`#C4`) · trauma (`#C2`). **No inferir un NO**: sin pregunta contestada NO es `no_confirmado` (`RSN` §1 R3) |
| "Tiene una evaluación psicológica que menciona la trata" | Hardship | `CFR-C` §214.209(b)(3) L459; `PM-B` §E.2 L647 | `#H6`, tres capas: **el HECHO** (existe evaluación / menciona la trata) es tuyo; la **atribución** es del perito; el **umbral** es del abogado |
| "Su condición médica no se trata en su país" | Hardship | `CFR-C` §214.209(b)(2) L457 | `#H5`. **No confundir con `#P3`** — ver el par en §4 |
| "El único daño es económico" | Hardship | `CFR-C` §214.209(b)(9) L471; `FR-2024` L988; `PM-B` §E.1 L624-626 | **NO dispara `bright_line_no`.** El Final Rule retiró la exclusión categórica: entra a la totalidad de `#H1` (`06` L1484-1509) |
| "La sección se cortó / no se llegó a preguntar" | cualquiera | `RSN` §4; `SK-RS` | **Gap de EJECUCIÓN** (la pregunta existe → re-preguntar) vs **gap de DISEÑO** (no existe → entrevista dirigida). El estado es `no_confirmado` en ambos |
| "Un elemento crítico cerró en NO" | cascada | `RSN` §1 R4; `06` `#C1` L374-409 | Los downstream **de ese escenario** son `no_aplica` por moot. Casca **sólo** ante `bright_line_no`, nunca ante gap |
| El caso pinta DV / U / VAWA / asilo / SIJS / inadmisibilidad | — | **ninguna ruta de este paquete** | Lane discipline (`RSN` §0 R3): no se analiza, se levanta **flag de referido** en una línea. Ver §9 |

---

## §6 — Case-law federal: qué ficha resuelve qué duda

25 fichas. **Todas las rutas de esta sección se prefijan `CL-FED/`** (= `corpus/case-law/federal/`). La
columna **Origen** cumple la regla 3 del lote:

- **APÉNDICE PM** — la referencia el *Appendix: Case Law References for T Visa Adjudications* (`APX-PM`,
  3 USCIS-PM B). **19 fichas**, cada una con `pm_appendix_concepts:` en su frontmatter.
- **EXTENSIÓN DEL PROYECTO** — **no** está en el apéndice; la agregó la KB de la firma. **6 fichas.**

### §6.1 — Las 19 del apéndice PM, por el concepto con que el apéndice las agrupa

El agrupamiento es **el del apéndice**, no una taxonomía propia — por eso es la llave determinística.

| Concepto del apéndice | Fichas (prefijo `CL-FED/`) | Duda que resuelven |
|---|---|---|
| **Threats of harm or serious harm** | `united-states-v-dann-9th-cir-2011.md` · `united-states-v-farrell-8th-cir-2009.md` · `united-states-v-djoumessi-6th-cir-2008.md` · `united-states-v-bradley-1st-cir-2004.md` · `united-states-v-warren-11th-cir-1985.md` · `united-states-v-udeozor-4th-cir-2008.md` | ¿Qué amenaza es "suficientemente seria"? Vantage point de la persona razonable en el lugar de la víctima; no se exige restricción física; la oportunidad de escapar es irrelevante bajo miedo; el abuso sexual puede ser una de las formas de fuerza |
| **Abuse or threatened abuse of legal process** | `clyatt-v-united-states-scotus-1905.md` · `united-states-v-reynolds-scotus-1914.md` · `pollock-v-williams-scotus-1944.md` · `bailey-v-alabama-scotus-1911.md` · `united-states-v-kozminski-scotus-1988.md` · `united-states-v-kaufman-10th-cir-2008.md` · `united-states-v-farrell-8th-cir-2009.md` · `united-states-v-djoumessi-6th-cir-2008.md` · `united-states-v-veerapol-9th-cir-2002.md` · `united-states-v-calimlim-7th-cir-2008.md` · `nunag-tanedo-v-east-baton-rouge-cdcal-2011.md` · `ruiz-v-fernandez-edwash-2013.md` · `elat-v-ngoubene-dmd-2014.md` | ¿Cuándo la amenaza migratoria/legal es coerción? Deportación, arresto, institucionalización, demanda civil, dejar vencer la visa. El eje: el objetivo de la amenaza es intimidar para forzar labor |
| **Debt bondage** | `united-states-v-farrell-8th-cir-2009.md` | Deuda simple vs debt bondage: gastos que crecen, valor del trabajo que nunca alcanza a liquidar, sin límite de duración ni de monto. **Insumo directo de `#F4`** |
| **Compensation for labor** | `united-states-v-bradley-1st-cir-2004.md` | Que le hayan pagado no descarta labor forzada |
| **Non-traditional types of work** | `united-states-v-kaufman-10th-cir-2008.md` · `united-states-v-marcus-edny-2007.md` | "Labor or services" no se limita a trabajo económico; una relación consensual previa no descarta el delito |
| **Duration of victimization** | `united-states-v-pipkins-11th-cir-2004.md` · `united-states-v-djoumessi-6th-cir-2008.md` · `united-states-v-dann-9th-cir-2011.md` | La duración puede ser breve; basta que una porción del servicio haya sido involuntaria |

**Caveats que las fichas mismas traen (leerlos antes de apoyarse en el caso):**

| Ficha (prefijo `CL-FED/`) | Caveat |
|---|---|
| `united-states-v-dann-9th-cir-2011.md` L50 | El apéndice lo cita con **dos años distintos** ("2011" y "2001"). Verificado: 2011; "2001" es typo del apéndice |
| `united-states-v-djoumessi-6th-cir-2008.md` L52 | El apéndice lo cita como "538 F.3d 547" y como "538 F.3d **573**". Verificado: 547; "573" es typo del apéndice |
| `united-states-v-bradley-1st-cir-2004.md` L49 | *cert. granted, judgment vacated* — el vacatur fue un GVR de sentencia, no del análisis de forced labor que USCIS cita. Verificar historia posterior |
| `united-states-v-pipkins-11th-cir-2004.md` L47 | Vacated y **opinión reinstalada**; el análisis del §1584 ("any term") quedó en pie |
| `united-states-v-marcus-edny-2007.md` L48 | Vacated *on other grounds* por 2d Cir. y revisado por SCOTUS. El razonamiento de alcance del TVPA quedó |
| `united-states-v-kozminski-scotus-1988.md` L45 | **Superación legislativa PARCIAL.** Citarlo por la definición del §1584 (vigente); **NO** para acotar el alcance del §1589 |
| `united-states-v-warren-11th-cir-1985.md` L49 | La cita "772 F.2d 827" colisiona en CourtListener con "827 F.2d 772" (volumen/página transpuestos) |

### §6.2 — Las 6 de extensión del proyecto (NO están en el apéndice PM)

Ninguna es un caso de elementos de trata. Son herramientas **evidenciarias o procesales**.

| Ficha (prefijo `CL-FED/`) | Para qué se invoca | Frontera del mapa |
|---|---|---|
| `matter-of-chawathe-aao-2010.md` | Estándar de prueba: preponderancia ("more likely than not"), distinto de la carga de la prueba | **NO calibra estado.** Los cuatro estados son de **captura**, no de prueba (`CTR` §2.1). Es material del abogado |
| `matter-of-christos-inc-aao-2015.md` | El AAO revisa **de novo** en apelación | Procesal. Fuera del checklist |
| `matter-of-obaigbena-bia-1988.md` | Las aseveraciones del abogado **no son evidencia** | Evidenciaria. Fuera del checklist |
| `matter-of-yajure-hurtado-bia-2025.md` | Detención mandatoria / ausencia de facultad de fianza para EWI | **Otro lane** (detención). Flag de referido. La ficha misma advierte que su historia posterior **no** es verificable con certeza |
| `medina-tovar-v-zuchowski-9th-cir-2020.md` | Momento en que debe existir el vínculo del derivado (al **otorgamiento**, no al filing) | **Otro lane** (derivados; holding U-céntrico). Fuera de los 6 elementos del principal |
| `fatty-v-nielsen-wdwash-2018.md` | Jurisdicción de habeas / stay de remoción mientras USCIS adjudica | **Otro lane** (procesal). La ficha advierte que el fallo **no es monolítico** |

**Observación del preparador (§10.4 — no se incorporó nada por cuenta propia):** el apéndice cita
*Camayo v. John Peroulis & Sons Sheep* **dentro del paréntesis de Elat**. No tiene ficha en el corpus y
**no se rutea**. Se deja anotado para el director; traerlo sería juicio sobre qué es relevante.

---

## §7 — AAO: qué decisión para qué patrón

10 decisiones. **Todas las rutas de esta sección se prefijan `CL-AAO/`** (= `corpus/case-law/aao/`).
**Todas no-precedente — Nivel 7, persuasivo.** El README del corpus AAO consigna que en 2024 el AAO **no
aprueba T directamente en apelación**: la victoria máxima es el remand.

**Primer salto obligatorio:** `AAO-IDX` — es el índice de ruteo. Trae la tabla maestra (fecha · ID ·
outcome · primary issue · pattern label) y la sección **«Doctrina destilada acumulada (cross-case)»**,
agrupada por tema, con el enlace a la decisión que sostiene cada bullet. `CL-AAO/_schema.md` fija los
campos de la ficha; `CL-AAO/_template.md` es el molde; `CL-AAO/README.md` es el racional del corpus.

| Decisión (prefijo `CL-AAO/`) | Patrón / duda | Elemento | Frontera del mapa |
|---|---|---|---|
| `in-re-5845586-2020-04-24.md` | Vivienda-por-sexo de un no-pareja; DV y trata **coexisten** | Fin (sexo) | `#F12`/`#F13` — vivienda gratis = "algo de valor"; quid-pro-quo **articulado** |
| `in-re-7360790-2021-08-12.md` | Sexo extorsionado por un coyote a cambio de continuar el traslado | Acto/Medios/Fin | `#F2c` (ancla de la rama sexual) + `#F12`/`#F13` — el servicio de smuggling es "algo de valor" |
| `in-re-10106816-2021-10-22.md` | Hardship que falla por lazos sociales / tratamiento disponible / sin represalia dirigida | Hardship | `#H1` (totalidad) · `#H5` (no-disponibilidad no probada). Nota: el AAO además dudó de Acto/Medios |
| `in-re-10892507-2021-12-08.md` | Coerción sexual laboral **sin quid-pro-quo articulado** → acoso, no trata | Fin (sexo) | `#F12`/`#F13` — el **contra-ejemplo** de 5845586. Lane: U-visa |
| `in-re-11297648-2021-07-02.md` | Trata aceptada, hardship dispositivamente insuficiente (económico + trayectoria positiva) | Hardship | `#H1` — el elemento IV puede ser el punto de falla con la trata concedida |
| `in-re-13039037-2021-08-23.md` | "Se sentía obligado a pagar una deuda" **sin detalle económico probatorio** | Fin (deuda) | `#F4` — el contra-ejemplo: sin tasa, sin asignación del trabajo a la deuda, sin plazo, no se prueba bondage |
| `in-re-17756724-2021-11-18.md` | PTSD atribuido clínicamente + contacto continuado del traficante (el padre) sostienen el nexo de presencia | Presencia · Acto/Medios | `#P1` (nexo *directly related*) · `#H6` (atribución clínica) |
| `in-re-22819771-2023-08-15.md` | Retorno temporal y reingreso: amenazas vía tercero + PTSD documentado satisfacen **ambos** prongs | Presencia | `#P4` (continued victimization en el reingreso) · `#H6` |
| `in-re-23981595-2023-01-26.md` | Arreglo de smuggling voluntario **deviene** trata: labor forzada para un propósito **separado** del traslado | Acto/Medios/Fin | `#F2b` (ancla de la rama laboral) |
| `in-re-35887018-2025-02-26.md` | "Singled out" del grupo; labor que **excede** la completitud razonable del arreglo | Fin (IS) | `#F2b` · `#F2` |

**Cuatro caveats del corpus AAO, vinculantes para el ruteo:**

1. **No calibran umbrales.** Se consultan ante una duda de juicio concreta; no fijan el default (`SK-CL`).
2. **Sin nombres al output.** El patrón vive en el prompt; la cita vive en el corpus. Se cita como "AAO
   non-precedent \<fecha\>", nunca por peticionario (`RSN` §0 R7).
3. **Numeración de estatuto/reg desactualizada.** Las decisiones pre-2024 citan `22 USC 7102(8)` (hoy
   `(11)`) y `8 CFR §214.11(a)/(b)` (hoy `§214.201`/`§214.202`). **No copiar el cite pelado.**
4. **La distribución del corpus no es muestra representativa** (6 remand / 4 dismissed por selección
   curatorial). No se usa para inferir probabilidades de aprobación.

---

## §8 — Captura: las dos formas del intake

| Forma | Alias | Llave | Cómo se lee |
|---|---|---|---|
| **Módulo nuevo** (h-codes) | `MOD-H` | `h1`…`h22` + los códigos de Hardship (L83-93) | Trae el mapa **h-code → elemento → placeholder**. Es el instrumento; los dispositivos legales viven en el `06` (así lo declara su propio frontmatter) |
| **Formulario viejo** (Q-numbers) | `FORM-Q` | `Q<n>` **por silo** | Los Q-numbers **reinician en cada silo** (STT L338-407 · Labor L413-484 · DV L492-566). Un `Q8` suelto es ambiguo: **primero se identifica el silo, después el número** |
| Doctrina para el intaker | `MAN-INT` | por elemento | Explica en cristiano la doctrina detrás de cada pregunta (Actos L399 · Medios L630 · Fin L823 · Presencia L1067 · Cooperación L1121 · Hardship L1189 · Viabilidad L1352). Consumidor: el intaker |

**h-codes que el prompt cita, verificados en `MOD-H`:**

| h-code | L | Qué es | Elemento / placeholder |
|---|---|---|---|
| `h1` | 34 | "¿Trabajó donde vivía?" | Harboring — `#A6`/`#A7` |
| `h5` | 52 | Pago / control salarial | Servidumbre involuntaria — `#F2`/`#F3` |
| `h14` (14a/14b) | 47 | Amenaza legal (migración/policía · el resto) | Abuse of legal process — `#M9`/`#M10` |
| `h15c` / `h15d` | 55 (detalle 77) | Los **dos disyuntos** de "reasonably assessed": la deuda no bajaba/crecía · sin cuánto ni hasta cuándo | Debt bondage — `#F4`/`#F5` |
| `h20` | 63 | Nexo coerción → sumisión (20a/20b) | Coerción — `#M9`/`#M10` |
| `h21` | 66 | Edad-al-evento (abierta, no binaria) | Cooperación — `#C4` |
| `h22` | 57 | Acto sexual comercial / "algo de valor" | Commercial sex act — `#F12`/`#F13` |

**Regla de lectura (no negociable).** Se leen **los hechos, no la numeración**. Un h-code o Q-number que
no aparece en el intake que tenés enfrente **no existe** para ese caso: el elemento es `no_confirmado`
(`RSN` §5; `SK-FORM`).

**Las preguntas de rescreening NO viven en el corpus.** Los 6 bancos literales viven en `RSN` §4 (espejo
documental en `SK-RS`). El corpus aporta el **canon detrás** de las preguntas, no las preguntas. Ver §10.

---

## §9 — Cobertura del corpus (56/56)

Ledger contra `corpus/MANIFEST.md`. **Toda pieza aparece en una ruta o lleva razón declarada de por qué
no se rutea.**

| Grupo | Piezas | Ruteadas en | Estado |
|---|---|---|---|
| `corpus/doctrine/` | 3 | `06` → §3, §4 (espina). `04` → §4 (definiciones y *Observaciones USCIS* por sub-elemento: la autoridad de cada celda del `06`). `05` → §4 (Presencia/Cooperación/Hardship, ídem) | 3/3 ✅ |
| `corpus/capture/` | 4 | `MOD-H`, `FORM-Q`, `MAN-INT` → §8 | 3/4 · **1 declarada** ↓ |
| `corpus/manual/` | 4 | `PM-B` → §3, §4, §5 (columna vertebral del PM) | 1/4 · **3 declaradas** ↓ |
| `corpus/case-law/appendix-pm.md` | 1 | `APX-PM` → §6, es la **llave de agrupamiento** de las 19 fichas | 1/1 ✅ |
| `corpus/case-law/federal/` | 25 | §6.1 (19 del apéndice) + §6.2 (6 de extensión) | 25/25 ✅ |
| `corpus/case-law/aao/` | 14 | §7 — 10 decisiones + `AAO-IDX` (primer salto) + `README`/`_schema`/`_template` (infraestructura de curaduría, citadas en §7 por su función) | 14/14 ✅ |
| `corpus/references/statute/` | 3 | `INA-T` y `TVPA` → §3, §4. `SMUG` → §4 (`#F2b`) como **contraste**: define smuggling, no un elemento de T | 3/3 ✅ |
| `corpus/references/regulations/` | 2 | `CFR-C` → §3, §4 (nivel 2.º de toda ruta). `FR-2024` → §4 (`#F12`/`#F13` L523 · `#H1` L988) como **preámbulo/intención** | 2/2 ✅ |

### Piezas NO ruteadas — razón declarada (4)

| Pieza | Por qué NO se rutea |
|---|---|
| `corpus/manual/part-b-extreme-hardship.md` (**9 USCIS-PM B**) | **Contradiría una frontera firmada.** `#H1` adoptó el estándar **AUTÓNOMO** de §214.209(a); el `06` es explícito: *"NO se importa doctrina general de extreme hardship (p. ej. 240A(b)); son umbrales distintos y mezclarlos re-aplana"* (L1536-1539). Además esta Parte es estructuralmente **QR-céntrica** (gira sobre el *qualifying relative*), mientras el hardship de T corre sobre **el aplicante mismo** (`PM-B` L658). Se conserva como **contraste doctrinal** — no como vara. Rutearla sería importar por la puerta de atrás lo que la firma del abogado excluyó |
| `corpus/manual/part-j-trafficking-victim-based-adjustment.md` (**7 USCIS-PM J**) | **Fuera de la ventana temporal del specialist.** Es el ajuste de estatus (post-aprobación, 3 años de presencia continua). El specialist analiza **elegibilidad inicial** de los 6 elementos. Se conserva por autocontención del paquete legal |
| `corpus/manual/part-o-victims-of-trafficking.md` (**9 USCIS-PM O**) | **Otro lane.** Waivers e inadmisibilidad — `RSN` §0 R3 lo excluye por nombre ("inadmisibilidad → flag de referido"). El cómputo de inadmisibilidades pertenece a otro specialist. Se conserva por autocontención |
| `corpus/capture/guia-construccion-formulario-v0.md` | **Otro consumidor.** Es el plan de cambios al formulario vivo, dirigido a la **jefatura de intake** (qué pregunta agregar y en qué línea del template). No aporta doctrina ni captura al análisis de un caso. Se conserva porque documenta el origen de los h-codes nuevos |

**Ninguna fila del mapa apunta a un archivo inexistente** — verificado por script contra el filesystem,
no a ojo (regla 1 del lote).

---

## §10 — Observaciones para el director

Lo que el barrido encontró y **no** se tocó, por §10.4 (regla estricta del preparador) y §10.5 (surfacear
discrepancias, no ampliar scope en silencio). **Dos quedaron RESUELTAS en el gate del director del
2026-08-19** (lectura entera del mapa); el resto sigue **ABIERTO**, pendiente de una reconciliación futura de metadata.

0. **RESUELTA (2026-08-19) — Hardship: la puerta de atrás queda cerrada.** El director ratificó el ruteo
   de §9: `corpus/manual/part-b-extreme-hardship.md` (9 USCIS-PM B) queda como **contraste, NUNCA como
   vara**. **`#H1` manda** — el estándar es el AUTÓNOMO de §214.209(a). En palabras del director:
   *"cerramos la puerta de atrás para Hardship"*. La fila de §9 y la nota de precedencia de §3 quedan
   firmes por decisión, no sólo por lectura del preparador.

1. **RESUELTA (2026-08-19) — la jerarquía del mapa.** El barrido había surfaceado que la spec del lote
   (*estatuto → regulación → Policy Manual → case-law persuasivo*) queda **invertida** respecto de la
   escala declarada en las fichas (case-law federal `nivel_autoridad: 4`, Policy Manual Nivel 5, `06`
   L1494). **El director decidió: la jerarquía del mapa es la de §2 — Policy Manual POR ENCIMA del
   case-law.** Razón registrada: el agente evalúa **cómo adjudicaría USCIS**; los casos **persuaden, no
   mandan**. La reconciliación de las etiquetas `nivel_autoridad` de las fichas **queda pendiente como
   trabajo futuro**, no acá — este mapa no toca metadata del corpus.

2. **ABIERTA. `nivel_autoridad: 4` es plano y aplana.** SCOTUS y una orden de distrito no
   publicada comparten tier. Varias fichas ya marcan la tensión como pendiente de la KB. No se cambió
   ningún valor. Entra en la reconciliación de etiquetas pendiente (obs. 1).

3. **ABIERTA. `CL-FED/medina-tovar-v-zuchowski-9th-cir-2020.md` no declara su procedencia.** Las otras 24 fichas la
   declaran (19 con `pm_appendix_concepts:`, 5 con la fórmula "de los 7 del README, NO del apéndice").
   Esta no dice ni una cosa ni la otra. **Se clasificó como extensión del proyecto por verificación
   directa contra el texto de `APX-PM`** (no aparece ahí), no por su metadata. La etiqueta faltante es un
   arreglo de una línea si el director lo quiere.

4. **ABIERTA. Los Q-numbers del prompt no resuelven a un silo único.** `RSN` cita Q4/Q5.2/Q8/Q10/Q14/Q15/Q16/Q23,
   pero en `FORM-Q` la numeración **reinicia por silo**: `Q5.2` sólo existe en STT; `Q15`/`Q16`/`Q23` sólo
   en Labor y DV (STT termina en Q14). Ningún silo contiene los ocho. En los golden esto no rompe (cada
   caso trae su propio silo), pero **como llave de ruteo el Q-number es ambiguo sin el silo** — así quedó
   documentado en §8. Si el prompt pretendía un silo coherente, es una inconsistencia del prompt, no del
   mapa.

5. **ABIERTA. `SK-RS` apunta a `corpus/capture/` como fuente de los 6 bancos, y los bancos no están ahí.**
   `MAN-INT` no contiene bancos de rescreening, ni la distinción gap-ejecución/gap-diseño, ni los silos,
   ni los "ramos" de smuggling (verificado por grep: cero ocurrencias). Los bancos literales viven en
   `RSN` §4 — y la propia skill lo dice dos líneas más abajo. El mapa ruteó a la fuente **real** (§8) y
   deja anotada la contradicción interna de la skill.

6. **ABIERTA. `FR-2024` es navegable sólo a medias.** Sin frontmatter (única pieza del corpus sin él), jerarquía de
   headings inconsistente, y ~la mitad de las secciones del texto codificado (§§214.205-207, .209, .210,
   .213, .214) aparecen como párrafo plano, no como heading — quien navegue por outline las pierde aunque
   el texto esté completo y verbatim. Trae además furniture del Federal Register interleaved y un tag
   `<page_number>` suelto (L4336). **Por eso el mapa lo rutea sólo para preámbulo/intención (L523, L988) y
   manda el texto codificado a `CFR-C`**, que está limpio. Coincide con un pendiente de reparación ya
   registrado.

7. **ABIERTA. `FORM-Q` tiene un defecto de numeración en el silo STT**: dos ítems consecutivos rotulados "7.-"
   (L381, L383). Es bug del documento fuente. No se tocó.

8. **RESUELTA (2026-08-19) — `retrieval/README.md` actualizado a entregado en este mismo commit.** Antes
   tenía una etiqueta de estado desactualizada. Sigue siendo cierto como descripción histórica; si el
   director quiere marcarlo entregado, es una línea. **No se editó** — está fuera del scope de este
   barrido.

---

*Este mapa es soporte cognitivo para el ruteo del análisis. No decide elegibilidad ni filing: esa
decisión es del humano con licencia profesional (7º principio del proyecto).*
