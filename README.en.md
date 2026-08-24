**English** · [Español](./README.md)

# T-Visa Specialist

> [!CAUTION]
> # ⚠️ EXPERIMENTAL LABORATORY — NOT FOR PRODUCTION USE
>
> ### **This software is not a substitute for the advice of an attorney.**
>
> - **Not in production.** This system has never been used to evaluate any client's case.
>   **No legal or commercial decision has ever been made based on this tool.**
> - **It does not replace human judgment — by design.** Its outputs are never eligibility
>   determinations: they organize evidence for licensed professionals, who make every decision.
> - **The embedded legal corpus is a dated snapshot** (see [`corpus/MANIFEST.md`](./corpus/MANIFEST.md)).
>   The law changes — always verify against primary sources.
>
> **Intended use:** research, evaluation, and operation under the supervision of licensed attorneys.
> Any other use is outside the design and the intent of this project.

An analysis agent for the T-Visa (`8 USC 1101(a)(15)(T)`) — it evaluates intake evidence against the
legal canon and reports which elements it captures and in what state. It ships as a standalone package:
the prompt, an embedded legal corpus with traceable provenance, a deterministic retrieval map, and the
runner that evaluates it.

## What this agent does NOT do

> **Analysis skills never decide eligibility. Their output is cognitive support for the paralegal and
> the attorney, not the system's adjudicative judgment.**

This is the principle that governs the entire design, not a safety layer bolted on at the end. The
agent does not say whether a case "sells", nor does it assign a strength label. For each of the relief's
six elements (Act · Means · Purpose · Physical Presence · Cooperation · Hardship), it emits one of four
states — `present` / `no_confirmado` / `bright_line_no` / `no_aplica` — each anchored to specific text in
the intake. None of them is a conclusion about the case. The decision on eligibility and on filing always
belongs to a licensed human professional.

The underlying reasoning — automation bias, the difference between the factual gradient and the
adjudicative gradient, and why "strength" isn't a property the system can know — is developed in
**[`PHILOSOPHY.en.md`](./PHILOSOPHY.en.md)**.

## What the package contains

```
prompt/       the reasoning + the output contract (the agent)
corpus/       the embedded legal canon, with provenance (MANIFEST.md)
retrieval/    deterministic map: which file resolves each question
skills/       the agent's capabilities, broken down and auditable
config/       live version, model, parameters (agent.json)
evals/        empty of cases — see "Evaluate with your own golden set" ↓
tools/
├── eval-runner/    the generic runner (assemble-prompt.mjs + eval-skill.mjs)
└── canon-watch/    watchdog for the freshness of the embedded statute/regulation
```

Each folder has its own README with one line per file, and a pointer to
[`retrieval/retrieval-map.md`](./retrieval/retrieval-map.md) as the master index — the agent never
guesses where to look for a source, and neither should whoever reads it.

## Evaluate with your own golden set

This package ships **without** test cases. Each firm validates against its own practice, not someone
else's — see [`evals/README.md`](./evals/README.md) for the why and how to build your own. In short,
from the root of the repo:

```bash
# assemble the live prompt
node tools/eval-runner/assemble-prompt.mjs --out /tmp/assembled.md

# run against your golden set
node --env-file=.env tools/eval-runner/eval-skill.mjs \
  --skill visa-t --prompt-file /tmp/assembled.md --prompt-version <yours>
```

## Freshness of the legal canon

```bash
node tools/canon-watch/check-canon-freshness.mjs
```

It compares the embedded statute and regulation against the official source (eCFR, govinfo/GPO) and
**reports** whether they've gone stale — it never updates the canon on its own. See the script and
[`corpus/MANIFEST.md`](./corpus/MANIFEST.md) § "Canon monitoring" for the Policy Manual and case law,
which don't have an equivalent versioning API.

## License

Apache License 2.0 — see [`LICENSE`](./LICENSE).

## Authorship

Christopher Mena · [github.com/chrismena87](https://github.com/chrismena87)
