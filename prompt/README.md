# `prompt/` — el agente

Razonamiento (doctrina) + contrato de output + la regla del ensamble. En runtime, `reasoning.md` +
`contract.md` se concatenan = el prompt `evidence-v1.2`.

**Cómo navegar esto:** este es el **cómo razona / qué emite** del agente. El **de dónde saca la
doctrina** que cita por ID vive en `../corpus/`, y el **mapa de qué archivo resuelve qué duda** es el
índice maestro [`../retrieval/retrieval-map.md`](../retrieval/retrieval-map.md) (alias `RSN` para
`reasoning.md`, `CTR` para `contract.md` — así los cita el mapa).

| Archivo | Qué es |
|---|---|
| `reasoning.md` | Razonamiento derivado del canon (§0–§6). Cita el canon por ID. Alias del mapa: `RSN`. |
| `contract.md` | Contrato de output: header 3-estados + cobertura 4-estados. Alias del mapa: `CTR`. |
| `assemble.md` | La regla del ensamble A+B (hoy implícita → explícita). |
