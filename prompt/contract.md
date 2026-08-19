---
documento: "Contrato de output del T-Visa specialist — capa parseable + síntesis, separadas"
version: "evidence-v1.2"
estado: "Vivo. Artefacto B del prompt del agente (se ensambla en runtime con reasoning.md, ver assemble.md)."
regla: "Fidelidad sobre invención. Los bloques marcados VERBATIM son copia literal del prompt; el resto es estructura de extracción."
---

# Contrato de output del Visa T specialist

> **Qué es.** El **Paso 1** del plan de ejecución del rebuild (ver `rebuild-diagnostico-2026-08-15.md`
> §4): separar el output del specialist en sus dos capas y **formalizar la capa parseable** que el
> runner (Paso 2) va a leer. Es una **extracción fiel** de v3.5h §Formato — no reescribe doctrina, no
> inventa campos, no resuelve ambigüedades. Lo que el prompt vivo deja implícito se lista en §5
> (*cuestiones del contrato*) para que el director decida antes del runner. **El prompt vivo no se
> toca en este paso.**

---

## 1. Las dos capas del output (D2)

El output del specialist tiene dos naturalezas que hoy conviven en `§Formato del output`. Este
contrato las separa:

| Capa | Qué es | Quién la consume | Sección de esta spec |
|---|---|---|---|
| **PARSEABLE (el contrato)** | La *Cobertura detallada* 4-state: 6 elementos, cada uno con `state` + `basis` (+ campos condicionales) | El **eval runner** (parsing estricto) | §2 |
| **PROSA (la síntesis)** | Header de síntesis técnica (3 estados), Escenarios evaluados, Atención del abogado, Flag de referido, Próximo paso, Para el case manager | El **abogado / paralegal** (lectura <1 min) | §3 |

La capa parseable es lo que se **formaliza** aquí (D3: no se construye un digest nuevo — se eleva la
capa 4-state ya latente a contrato explícito). La capa prosa se **documenta y delimita**, pero su
contenido doctrinal vive en el razonamiento (el otro artefacto de D2).

---

## 2. La capa parseable — el contrato 4-state

### 2.1 Los cuatro estados (VERBATIM de v3.5h L1485-1502; def. ADR-035)

- `present` — evidencia afirmativa capturada en el intake para este elemento. NO significa elemento
  legalmente satisfecho ni caso fuerte; significa "hay hechos que lo apoyan, anclados al intake". La
  fortaleza doctrinal la lee el abogado con su lente de apetito de riesgo.
- `no_confirmado` — el intake no capturó información suficiente para afirmar o descartar este
  elemento. Ausencia de evidencia, NO evidencia negativa. Es gap rescuible.
- `bright_line_no` — el cliente confirmó NO a una pregunta SI/NO dispositiva del cuestionario, lo
  cual descarta el vector estructuralmente. **Exige dos campos adicionales obligatorios**:
  `source_question: <Qn>` y `source_answer: <respuesta verbatim>`. Sin esos campos, NO puede emitirse
  este estado — cae a `no_confirmado`. El bright-line real solo viene de pregunta dispositiva
  confirmada, NUNCA de inferencia narrativa.
- `no_aplica` — el vector estructuralmente no pertenece al caso (ej. el cliente entró legal →
  smuggling no aplica; el escenario más fuerte cierra en `bright_line_no` → elementos downstream son
  `no_aplica` por moot, no por gap).

### 2.2 Campos obligatorios y condicionales

| Campo | Cardinalidad | Regla (VERBATIM L1504-1506, L1492-1496) |
|---|---|---|
| `state` | obligatorio | uno de los cuatro de §2.1 |
| `basis` | **obligatorio en todos los estados** | "anclaje específico al texto del intake (preguntas Q1-Qn, respuestas verbatim, narrativa). Sin ancla concreta al texto, el estado no se puede emitir." |
| `source_question` | obligatorio **si** `state = bright_line_no` | `<Qn>` |
| `source_answer` | obligatorio **si** `state = bright_line_no` | `<respuesta verbatim>` |

### 2.3 Prohibiciones y reglas de emisión (VERBATIM L1508-1522)

- **Prohibido cualquier estado de fuerza** (`partial`, `weak`, `strong`, `likely`, `unlikely`). La
  debilidad fáctica observable de un sub-elemento se describe en la prosa doctrinal que sigue al
  checklist, NO como state. Si dudás entre `present` (con caveats sobre fortaleza) y `no_confirmado`
  (gap), elegí `no_confirmado` y articulá en `basis` qué pregunta dispositiva del sub-elemento
  cerraría la duda.
- **Conflicto** (evidencia a favor Y en contra del mismo elemento): reportar `state: present` según
  la evidencia afirmativa Y señalar la contradicción explícitamente en la prosa que sigue al
  checklist, SIN resolverla. NO colapsar al "más conservador". El estado `conflicted` pertenece al
  consolidador, no a este specialist.

### 2.4 Formato parseable (VERBATIM L1526-1533 — "el eval runner lo lee")

```
Acto — state: <state>; basis: <basis>
Medios — state: <state>; basis: <basis>
Fin — state: <state>; basis: <basis>; [si bright_line_no:] source_question: <Qn>; source_answer: <verbatim>
Presencia — state: <state>; basis: <basis>
Cooperación — state: <state>; basis: <basis>
Hardship — state: <state>; basis: <basis>
```

### 2.5 Ejemplo del formato parseable (VERBATIM L1537-1544 — bright-line real en Fin)

```
Acto — state: present; basis: Q8 describe retención de pasaporte por empleador.
Medios — state: no_confirmado; basis: Q14/Q15 sobre amenazas migratorias no se preguntaron en el intake.
Fin — state: bright_line_no; source_question: Q23; source_answer: NO; basis: cliente confirma no haber tenido sexo con terceros bajo coerción.
Presencia — state: no_aplica; basis: moot porque Fin en bright_line_no.
Cooperación — state: no_aplica; basis: moot porque Fin en bright_line_no.
Hardship — state: no_aplica; basis: moot porque Fin en bright_line_no.
```

### 2.5-bis Adición deliberada — campo `scenario:` (Q-C3, ÚNICA desviación de fidelidad)

**Esta es la única adición del Paso 1 al formato de v3.5h — deliberada y documentada.** El checklist
cubre *un* escenario ("el más fuerte", §2.6), pero v3.5h **no nombra cuál** en el bloque parseable: el
parser tendría que adivinarlo. Se agrega una **primera línea `scenario:`** que nombra el T-angle al
que refiere la cobertura, tomándolo textual del bullet correspondiente de Escenarios evaluados
(§3.2). Justificación: sin ella el runner no puede ligar la cobertura a su escenario ni comparar
contra el golden de forma inequívoca. Formato aumentado:

```
scenario: <tipo de T del escenario cubierto, textual del bullet de Escenarios>
Acto — state: <state>; basis: <basis>
Medios — state: <state>; basis: <basis>
Fin — state: <state>; basis: <basis>; [si bright_line_no:] source_question: <Qn>; source_answer: <verbatim>
Presencia — state: <state>; basis: <basis>
Cooperación — state: <state>; basis: <basis>
Hardship — state: <state>; basis: <basis>
```

Todo lo demás del formato queda **VERBATIM** (§2.4). Esta adición es cambio de contrato menor, no de
doctrina; el prompt vivo la incorporará cuando se reescriba (Paso 4), no en el Paso 1.

### 2.6 Los seis elementos y su ancla de norma

El checklist cubre **el escenario más fuerte** (o el relevante a la síntesis — L1481-1482). Cada
elemento lleva su recordatorio doctrinal corto en el prompt (L1550-1581); la doctrina plena vive en
el razonamiento (§Marco legal). Anclas de norma tal como el prompt las cita:

| Elemento | Ancla (VERBATIM del prompt) |
|---|---|
| Acto | `22 USC 7102(11)`; `8 CFR §214.201` |
| Medios | `22 USC 7102(3)`; `8 CFR §214.201` |
| Fin | `22 USC 7102(11)`; `8 CFR §214.201` |
| Presencia | `INA 101(a)(15)(T)(i)(II)`; `8 CFR §214.207` |
| Cooperación | `INA 101(a)(15)(T)(i)(III)`; `8 CFR §214.208` |
| Hardship | `INA 101(a)(15)(T)(i)(IV)`; `8 CFR §214.209(a)-(b)` |

---

## 3. La capa prosa — la síntesis (separada del contrato)

Esta capa **no la parsea el runner**. Se delimita aquí para que quede claro qué NO entra al contrato
parseable. Su contenido doctrinal vive en el razonamiento.

### 3.1 Síntesis técnica — header de 3 estados (VERBATIM L1343-1356)

- `Rescreening necesario` — al menos un elemento del checklist está en `no_confirmado`.
- `Sin elementos de Visa T` — los elementos críticos están en `bright_line_no` o `no_aplica`.
- `Elementos de Visa T completos` — todos los elementos críticos en `present` con `basis`.

Reglas de elección (L1358-1379, monotonicidad ADR-035): `Rescreening necesario` > `Sin elementos de
Visa T` > `Elementos de Visa T completos` (default conservador al más alto).

**Resuelto (ver §5): el LLM sigue emitiendo el header (Q-C1) y el runner lo RE-DERIVA de la cobertura
para comparar (mismatch = razonamiento inconsistente). "Elementos críticos" = LOS SEIS elementos de
elegibilidad (Q-C2, aclaración); la jerarquía la hace la cascada de estados, no un subconjunto.**

**Formato del header — LÍNEA OBLIGATORIA E INESCAPABLE.** El output SIEMPRE abre con **una** línea exacta:

```
Síntesis técnica: <Rescreening necesario | Sin elementos de Visa T | Elementos de Visa T completos>
```

Es la primera línea del output, uno de los tres valores literales de arriba, sin variantes ni adornos.
No la omitas, no la reformules, no la fundas con prosa — si falta o no matchea, el runner no puede
parsearla y el caso cuenta como error de formato (lección 009, que salió sin header parseable).

### 3.2 Escenarios T evaluados (L1387-1479) — PROSA con emoji

Bullets con vocabulario de semáforo `🚫/⚠️/❌/✅`. **Este emoji NO es el contrato parseable** — es
señalización de prosa. El mapping emoji→state (✅→`present`, ❌→`no_confirmado`, 🚫→`bright_line_no`,
N/A→`no_aplica`, ⚠️→resolver) vive en §Reglas de razonamiento del prompt. **Ver Q-C5 (§5).**

### 3.3 Atención del abogado · Flag de referido · Próximo paso · Para el case manager

Prosa accionable, delimitada en L1593-1738 (contenido permitido/prohibido, lane discipline, regla 7
de confidencialidad, cierre obligatorio *"Sugerencia automática, no consejo legal. Validación humana
requerida."*). No entra al contrato parseable. Vive con el razonamiento/síntesis.

---

## 4. Provenance (cada pieza → su origen en v3.5h)

| Pieza de este contrato | Origen en `visa-t-specialist.md` v3.5h |
|---|---|
| 4 estados (§2.1) | L1485-1502 |
| Campos `basis`/`source_*` (§2.2) | L1492-1496, L1504-1506 |
| Prohibiciones + conflicto (§2.3) | L1508-1522 |
| Formato parseable (§2.4) | L1526-1533 |
| Ejemplo parseable (§2.5) | L1537-1544 |
| Elementos + anclas (§2.6) | L1481-1482, L1550-1581 |
| Header 3-state (§3.1) | L1343-1379 |
| Escenarios / emoji (§3.2) | L1387-1479 + §Reglas de razonamiento |
| Atención / referido / próximo paso / case manager (§3.3) | L1593-1738 |

---

## 5. Cuestiones del contrato — DESPACHADAS por el director (2026-08-15)

Las seis ambigüedades que la extracción detectó se resolvieron. Cada resolución fija cómo el runner
(Paso 2) parsea, asevera o re-deriva. (Subordinado al 7º principio: el sistema surfacea, el humano
decide — decidido acá.)

- **Q-C1 — ¿El header 3-state es EMITIDO o DERIVADO?**
  **Resuelto: AMBOS.** El LLM sigue emitiendo el header (es la síntesis humana); el runner lo
  **RE-DERIVA** de la cobertura y **compara**. Mismatch = señal de razonamiento inconsistente
  (diagnóstico gratis). Impacto en el runner: re-derivación + assertion de consistencia header↔cobertura.

- **Q-C2 — ¿Cuáles elementos son "críticos"?**
  **Resuelto: LOS SEIS elementos de elegibilidad.** La jerarquía la hace la cascada de estados (el
  moot de #C1/downstream), no un subconjunto privilegiado. Registrado como **aclaración** del
  contrato, no cambio.

- **Q-C3 — ¿Cómo sabe el runner qué escenario cubre el checklist?**
  **Resuelto: SÍ al campo `scenario:`** (ver §2.5-bis). Es la **única adición del Paso 1** al formato
  de v3.5h — deliberada y documentada; sin ella el parser adivina. Es la única desviación de
  fidelidad, con su justificación.

- **Q-C4 — ¿Dash-prosa o estructurado?**
  **Resuelto: DASH-PROSA ahora.** El runner en modo diagnóstico corre contra outputs **reales de
  v3.5h** y debe parsear lo que v3.5h emite. La migración a estructurado (JSON/YAML) es **candidata
  del Paso 4** (contrato v2), no de este paso.

- **Q-C5 — ¿Alcance de las assertions?**
  **Resuelto: dos naturalezas.** Assertions **SEMÁNTICAS sobre `state`** (valor exacto — la taxonomía
  4-state está frozen). Assertions **ESTRUCTURALES sobre `basis`/`source_*`** (presencia y no-vacío
  cuando son obligatorios; **nunca sobre el contenido**). El basis no se asevera por igualdad de texto.

- **Q-C6 — `no_aplica` moot vs. estructura.**
  **Resuelto: NO distinguir ahora** (exigiría cambiar el contrato). El colapso a `no_aplica` (con la
  razón en `basis`) es suficiente para el Paso 2. Candidato para **contrato v2 en el Paso 4**.
