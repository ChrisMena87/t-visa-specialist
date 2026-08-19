# La regla del ensamble — `evidence-v1.2`

El prompt vivo del specialist T **no es un archivo**: es el **ensamble en runtime** de dos artefactos.
Esta regla, antes implícita en el script de corrida, queda acá explícita.

## Qué se concatena

```
prompt evidence-v1.2  =  reasoning.md  +  contract.md
                         (Artefacto A)     (Artefacto B)
```

- **`reasoning.md` (A)** — define **cómo razona**: la doctrina, las reglas de asignación de estado, las
  trampas del canon citadas por ID.
- **`contract.md` (B)** — define **qué emite**: el header de 3 estados + la cobertura de 4 estados
  (parseable por el eval runner) + la capa prosa delimitada.

## El orden y la juntura (exacto)

A **antes** que B, separados por una juntura visible. El ensamble que produjeron las corridas del rebuild
(reproducible) es:

```
# VISA T SPECIALIST — evidence-v1

(Prompt ensamblado: Artefacto A razonamiento + Artefacto B contrato.)

<cuerpo de reasoning.md, sin su frontmatter YAML>


=====================================================================


<cuerpo de contract.md, sin su frontmatter YAML>
```

**Regla:** se ensamblan los **cuerpos** (el frontmatter YAML de cada artefacto es metadata de mantenimiento,
no va al prompt). El separador de línea completa marca la frontera A|B.

## Cómo se corre (con el runner)

El runner recibe el ensamble ya construido vía `--prompt-file`:

```bash
node --env-file=.env tools/eval-runner/eval-skill.mjs \
  --skill visa-t \
  --prompt-file <ensamble-A+B> \
  --prompt-version evidence-v1.2
```

*(Candidato futuro registrado: que el runner construya el ensamble desde `reasoning.md` + `contract.md`
directamente, en vez de recibir un archivo pre-ensamblado. Hoy el ensamble se materializa antes de correr.)*
