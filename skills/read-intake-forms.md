# Skill — leer las dos formas de intake

> **Espejo documental.** Fuente de verdad: `../prompt/reasoning.md §5`. Si divergen, **gana §5**.

## Qué hace

El intake puede venir en **dos formas**, ambas válidas:

- **Forma del módulo nuevo** — preguntas con **h-codes** (h1, h5, h15c, h20, h22…) mapeadas a
  placeholders del 06.
- **Forma del formulario viejo** — preguntas con **Q-numbers** por silo (STT / Labor / DV).

## La regla

**Leé los hechos, no la numeración.** El estado de un elemento se asigna por el **hecho capturado**
(reglas de §1), sea cual sea la forma. No supongas que un h-code o Q-number "existe" si no está en el
intake que tenés enfrente; un elemento cuya pregunta no aparece es `no_confirmado` (§1 R3, §4 gap).

Fuente en `corpus/`: el módulo de captura (`corpus/capture/modulo-t-preguntas`) define el mapa h-code →
placeholder.
