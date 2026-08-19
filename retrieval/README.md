# `retrieval/` — el Pantone del agente

El **mapa determinístico "dónde busco qué"**: tema/pregunta → fuente exacta dentro de `corpus/`. El
agente **nunca adivina dónde mirar**; cada duda de juicio tiene una fila que la manda a la percha de
canon que la resuelve. Es el esqueleto del routing determinístico que evita que el agente tenga que
inferir dónde buscar (ver `PHILOSOPHY.md` §5).

| Archivo | Qué es |
|---|---|
| `retrieval-map.md` | Tabla disparador → fuente, con dos decisiones de diseño explícitas en su §10: Hardship (el estándar general de la política de la agencia es **contraste, nunca vara** — el estándar autónomo del CFR manda) y jerarquía de consulta (**la política de la agencia va por encima del case-law** para este agente — ver `PHILOSOPHY.md` §6). Cobertura completa del corpus; cero rutas huérfanas. |
