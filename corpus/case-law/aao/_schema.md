# Schema de frontmatter — casos AAO T-Visa

Spec autoritaria del frontmatter YAML que lleva cada archivo de caso en
este corpus. Ver `README.md` para el contexto general y `_template.md`
para una plantilla lista a clonar.

**Nivel de autoridad:** los casos AAO no-precedente de este corpus son **Nivel 7**
(persuasivo, no vinculante) en la escala de 8 niveles de la KB. La escala tiene un
**hogar único** — la tabla del README raíz (`../../../../README.md`, § "Jerarquía de
autoridad"); no se redefine acá.

## Campos del frontmatter

### Identidad (obligatorio)

```yaml
case_id: "23981595"          # número sin prefijo "In Re:" ni espacios
case_full_id: "In Re: 23981595"  # forma humana
decision_date: 2023-01-26    # ISO 8601 (YYYY-MM-DD)
```

### Clasificación (obligatorio)

```yaml
relief: t-visa               # fijo en este corpus
outcome: remanded            # dismissed | remanded | sustained
primary_issue:               # lista; vocabulario controlado del README
  - smuggling-to-trafficking-transition
  - involuntary-servitude-via-threats
```

**Vocabulario de `outcome`:**

- `dismissed` — la apelación fue desestimada; la denegación del centro
  de servicio queda firme.
- `remanded` — la AAO devolvió el caso al centro de servicio con
  instrucciones (típicamente para aprobar o re-evaluar bajo el correcto
  estándar legal). En la práctica este es el outcome favorable máximo en
  apelación.
- `sustained` — la AAO sostuvo la apelación y aprobó directamente.
  **Rarísimo** — 0% en 2024 según datos CAST.

### Holding (obligatorio)

```yaml
holding_summary: |
  Una oración de 1-2 líneas resumiendo el holding central.

holding_bullets:
  - Primera proposición doctrinal específica
  - Segunda proposición (si aplica)
  - Tercera (max 4 bullets — si necesitás más, va al body)
```

### Citas (obligatorio si las hay)

```yaml
statute_cites:
  - "INA 101(a)(15)(T)(i)"
  - "22 USC 7102(11)"
cfr_cites:
  - "8 CFR 214.11(a)"
policy_manual_cites:
  - "3 USCIS-PM B.2"        # si la decisión cita Policy Manual con Chapter
```

### Relevancia al skill (obligatorio)

```yaml
skill_relevance:
  rules_anchored:
    - "v3.4 §Falsos positivos — sub-pattern smuggling con labor durante retención"
    - "v3.4 Regla 4 — semáforo (consistencia símbolo↔texto)"
  prompt_pattern_label: "smuggling-con-amenazas-mortales-forzando-labor"
  veredict_implication: |
    En casos donde hay amenazas serias (muerte, daño a familia)
    forzando labor durante retención de smuggling, Fin de explotación
    NO se cierra automáticamente en 🚫 aunque liberación haya sido
    al pago. ⚠️ es el call mínimo defendible.
```

`prompt_pattern_label` es el nombre genérico que el skill puede invocar
en su output bajo la regla 7 de confidencialidad — describe el patrón,
no nombra el caso.

### Source (obligatorio)

```yaml
source:
  parsed_from: "in-re-23981595-2023-01-26-raw.pdf"  # nombre del PDF original
  parsed_with: llamaparse                            # llamaparse | manual | claude-vision
  parse_date: 2026-05-29                             # cuando se hizo el parseo
  uscis_url: ""                                      # URL pública si está disponible
  parsed_md_path: "parsed/in-re-23981595-raw.md"    # ruta del markdown crudo si se preserva
```

### Status (opcional pero recomendado)

```yaml
status: curated              # raw | curated | reviewed
curated_by: "equipo interno"
review_notes: ""             # observaciones del curador
```

`status` flow:
- `raw` — solo el parseo crudo, sin trabajo humano.
- `curated` — frontmatter + body completos, listo para uso humano.
- `reviewed` — un segundo revisor (abogado, paralegal experimentado)
  validó la destilación doctrinal.

## Body del archivo (post-frontmatter)

Estructura obligatoria del body, en este orden:

```markdown
## Hechos relevantes

[Resumen narrativo cronológico de qué pasó al peticionario. ~150-300
palabras. Despersonalizado donde se pueda — usar "el peticionario" /
"la peticionaria" en vez del nombre real cuando aparezca. Es OK citar
hechos públicos del caso AAO; el objetivo de despersonalizar es que el
skill no use el nombre si por casualidad lo extrae.]

## Razonamiento del AAO

[Qué argumentos usó el adjudicador. ~200-400 palabras. Notar
explícitamente qué statute/CFR/PM citó la AAO y cómo lo interpretó.]

## Doctrina destilada

[1-3 bullets que sintetizan la lección para el skill. Cada bullet:
- Patrón de hecho (genérico)
- Consecuencia para el análisis T
- Cómo aterriza en el prompt (regla / sección)

Ejemplo:
- **Patrón: smuggling con amenazas mortales forzando labor adicional
  (ej. mula).** Cuando las amenazas exceden coerción típica de
  smuggling-extortion (amenaza de muerte, daño grave a familia) Y
  fuerzan labor diferente al pago de la deuda original, el Fin de
  explotación puede sostenerse. **No marcar 🚫 categórico** aunque
  Q14 = "se juntó el dinero" — el dispositivo es la intensidad de la
  coerción + el carácter de la labor forzada. Mínimo ⚠️ con
  rescreening sobre la naturaleza de la labor adicional.
  Aterriza en: v3.4 §Falsos positivos — sub-pattern smuggling con
  labor durante retención.]

## Cita textual relevante (opcional)

[Si hay un párrafo de la decisión que captura la doctrina con
precisión, citarlo aquí entre blockquote con número de página del PDF
original. Cita textual corta — el texto completo vive en `parsed/`.]
```

## Validación

Cuando se cree un caso nuevo, el frontmatter debe pasar estos checks:

1. `case_id` único en el corpus (no duplicar archivos).
2. `decision_date` válido y anterior o igual a hoy.
3. `outcome` en el vocabulario controlado.
4. `primary_issue` cada item en vocabulario controlado del README (o
   propuesto explícitamente como término nuevo).
5. `skill_relevance.prompt_pattern_label` no contiene nombres de personas
   ni identificadores específicos.
6. `source.parsed_from` apunta a archivo que existe (en `parsed/` o
   externo).

Cuando el eval runner exista, este schema será parseado por código y
estos checks pasarán a ser asserts en CI.
