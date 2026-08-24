**English** · [Español](./PHILOSOPHY.md)

# How to build a legal assistant that does not decide

### Design criteria of the T-Visa specialist

> [!CAUTION]
> **This software is not a substitute for the advice of an attorney. / Este software no sustituye el
> consejo de un abogado.** Es un laboratorio experimental: no está en producción, no se ha utilizado
> para evaluar ningún caso de ningún cliente, y ninguna decisión legal o comercial se ha tomado a
> partir de esta herramienta. Uso previsto: bajo supervisión de abogados con licencia. Ver el aviso
> completo en el [README](./README.en.md).

---

## 1. Why it exists

> **Democratize access to quality, affordable legal evaluations and services for those who could not
> afford a serious firm.**
> — ADR-027, *Project vocation: the golden circle*

Four words do the work. **Democratize**: the client who matters by default is the one who lacks access
today. **Evaluations and services**: not only acting, also analyzing — the system serves when someone
comes to find out what they have, even if they never retain counsel. **Quality**: not lowered to cut
cost; democratization loses its point if the accessible version is worse. **Affordable cost**: not
necessarily free, but reachable for the underserved segment.

A distinction worth saying out loud, because almost no one says it: **the commercial beachhead and the
ultimate beneficiary are not the same person.** Whoever pays first may be a boutique firm; who the
product is ultimately owed to is the underserved person. Conflating the two is how a mission-driven
project ends up building only for whoever signs the check.

From that follows the rule for what we build and what we don't. AI does **what is inherently AI** —
operating over the whole corpus at once, memory without fatigue, no ordering bias, no tribalism between
practice areas. AI does **not** do what is inherently human: empathy, rapport, social judgment, reading
credibility, presence. When the machine absorbs the cold cognitive load, the attorney is freed to be what
the underserved client most needs: someone who understands their story and walks with them over time.
The attorney stops being primarily a *legal technician* and becomes a **super social worker** (ADR-027
§How.2).

And from that follow the **explicit anti-features** — excluded by vocation, not by regulation, and the
difference matters because *regulation can be navigated with legal counsel and vocation cannot*
(ADR-027):

- Voice agents that feign empathy or rapport with the end client.
- "Lie detection" or credibility assessment of testimony.
- Predictors that sell outcome certainty ("your case has a 73% chance").
- Agents that present themselves as human to the end client.

A list of prohibitions that lives only in a document defends nothing, so this one is a **review gate**:
it runs **before** looking at code quality, because if the filter fails, the code doesn't matter yet.
The distinction that organizes the filter is between **generative AI** — structuring, suggesting,
summarizing, extracting, identifying candidates for professional review: sound — and **predictive AI
sold as certainty** — "your case will win", "this client is lying", "this relief applies" with no human
review: structural snake oil. It also fixes how the output is phrased: *"candidates to evaluate" yes;
"qualifies for X" no.*

And a final question that is both the most uncomfortable and the most useful:

> *If the end client understood exactly what this feature does, what data it uses, and its real error
> rate — would they use it with the same confidence?*

If the answer is "probably not", the feature **is being sold as better than it is**. That is snake oil
regardless of how technically sophisticated it is (`docs/snake-oil-filter.md`).

---

## 2. Non-adjudication: the constitutive principle

> **Analysis skills NEVER decide eligibility.** Their output is cognitive support for the paralegal
> and the attorney, not the system's adjudicative judgment.
> — the project's seventh principle

This is the principle everything else hangs from. It is not a safety layer bolted on at the end: it is
the shape of the system.

The failure mode it prevents is **structural, not technological**. It is documented in the aviation and
medicine literature as *automation bias*: when a system — with AI or without it, it makes no difference
— occupies the space of human judgment, responsibility dilutes across layers. Each layer trusts the
next. The result can be deliberate fraud (the professional hides behind "the system approved it") or
distributed negligence: nobody decides wrongly, everyone trusts the prior layer, and the client ends up
with a weak filing or a retainer charged with no real chance of approval.

In humanitarian visas the harm **always falls on the same side**: exposure to enforcement, denials,
money spent by people who didn't have it to spend.

The concrete mechanism that triggers it is mundane, and that's exactly why it's dangerous. A firm's
real flow is `intaker → junior QA paralegal → signing attorney`, and the attorney reviews at the speed
of *"50 intakes in 5 minutes"*. **If the skill occupies the paralegal's cognitive space with a closed
verdict, the paralegal echoes it; if the paralegal echoes, the attorney signs on an echo.** The review
chain collapses without anyone having done anything wrong (ADR-032, Context).

That's why disclaimers aren't enough. Keeping the conclusive labels while adding strong warnings was
explicitly considered, and rejected: *"disclaimers don't protect against automation bias… the junior
paralegal reads the label, not the disclaimer. **The word is the bias.**"* (ADR-032, Alternatives).

---

## 3. Evidence assessment, not verdict

The system's first version classified cases as `VENDE_ALTA`, `VENDE_CAVEATS`, `NO_VENDE`. That taxonomy
**is dead**, and it's worth explaining why, because the why is more useful than the replacement.

### There were two gradients, not one

- **Factual gradient** — are the facts that make up the elements established in the intake?
  **Yes, that belongs to the system.** It is verifiable against the form and the intake.
- **Adjudicative gradient** — given the facts, is the case an A/B/C for the agency to approve?
  **No, that does not belong to the system.** It belongs to the attorney, and it is **business risk
  appetite**: two competent attorneys will grade the same intake differently because they have
  different appetites. Some firms sell only A; others sell A/B/C.

Hence the deeper reason, stronger than the rule itself: **the skill cannot classify strength because
strength is not a property of the case.** It is a function of the attorney's lens. Any strength label
the system emits claims to know a risk appetite that isn't its own — and that claimed knowledge becomes
a shield ("the system approved it"), which is exactly the trap (ADR-034).

There was also a mechanical problem: the original seven categories were **a gradient disguised as
classes**. There is no objective boundary between "strong" and "partial". Asking a model to sort a
continuum into discrete classes makes it collapse toward the simplest category. No prompt refinement
fixes it: **the bug comes from the framework, not the model** (ADR-034, Root cause).

### What the system emits

Four states per element, and **none of them is a conclusion about the case** (ADR-035):

| State | What it says | Action it triggers |
|---|---|---|
| `present` | Affirmative evidence is captured in the intake. **Does not** mean the element is legally satisfied or that the case is strong. | continue |
| `no_confirmado` | The intake did not capture enough. **Absence of evidence, NOT negative evidence.** | rescreening |
| `bright_line_no` | Dispositive negative answer to a concrete question. Requires `source_question` + `source_answer`. | close the vector |
| `no_aplica` | The vector does not belong to the case per the captured facts. | exclude the vector |

The sentence doing the most work in the entire system: **`no_confirmado` means "not captured", never
"does not qualify".** Given the false-negative profile in trafficking — fear, non-comprehension,
non-recall — silence does not prove that something did not happen (ADR-034 §4).

Three formal rules sustain that (ADR-035):

- **`basis` is mandatory in every state.** Without an anchor to concrete questions or facts in the
  intake, there is no state. The model cannot assert without showing where it read it.
- **`bright_line_no` requires structured `source_question` + `source_answer`**, not buried in prose.
  Closing a vector is the most consequential act the system performs, so it is the one that leaves the
  most trace.
- **Any strength state is forbidden** (`partial`, `weak`, `strong`, `likely`). Observable weakness is
  described in prose for the attorney, never as a field.

And one property is baked into the geometry: **the residual under ambiguity is `no_confirmado` → ask
again, never `bright_line_no` → close.** The conservative failure mode is not an instruction the model
can forget; it is the shape of the state space (ADR-035).

"Elements complete" doesn't mean "sells" either. It means the facts are in the intake. If the attorney
decides to proceed, **the legal reframe lives in the filing** — declaration and cover letter — not in
the intake and not in the skill. Conflating those layers degrades each discipline (ADR-034 §8).

---

## 4. Cognitive support: concentrating human judgment, not replacing it

The design question is not *"how much can the machine decide?"* but *"where does the human need to be
looking?"*. A system that decides little but **concentrates the attorney's attention on the three things
only they can resolve** is worth more than one that decides a lot and leaves them reviewing noise.

The analysis engine is designed as a **chain of Socratic filters, not a decision pipeline** (ADR-032
§4). Each layer forces the next one to think:

- the intake recommender pushes the intaker to re-capture what's missing;
- the specialist pushes the paralegal to rescreen or rethink before passing the case to the attorney;
- the attorney's signature is the close.

**No layer closes the judgment of the next layer. Each one feeds the next one's input.**

Concretely, every doubt that surfaces is routed to one of three destinations:

| What surfaces | Where it goes | Why |
|---|---|---|
| **A gap** — the intake did not capture the fact | → **a question** (rescreening) | `no_confirmado` has exactly one funnel action: ask again (ADR-035) |
| **A generalizable boundary** — the same threshold recurs case after case | → **a rule signed** by a licensed human | Dispositive authority can only exist where the rule is human, explicit, and auditable (ADR-035); the rule is modeled as an entity with `approved_by`, `rationale`, `effective_date` (ADR-036) |
| **A particular boundary** — this case, this threshold, this risk appetite | → **the attorney** | This is the adjudicative gradient, which does not belong to the system (ADR-034 §6) |

> The *promotion criterion* — when a boundary is generalizable enough to become a signed rule — is an
> **open criterion: it gets defined through practice**, not through a threshold baked in ahead of time.
> The funnel above is faithful to the sources across its three destinations; the threshold in the middle
> row gets fixed case by case, under a licensed attorney's authority, instead of pretending one already
> exists.

The real gain: the attorney stops spending attention *finding* what's missing and spends it *deciding*
what only they can decide. That is what "freeing the human to be more human" means.

There is an ethical limit at the same boundary. The system pursues **what the client is willing to
disclose under competent, honest questioning — not the material truth**. We do not invent, we do not
exaggerate, we do not lead or push. Faced with competent denial across all vectors, the analysis closes
— even knowing that a fear-driven false negative is possible. The alternative (pushing to extract
testimony) produces the harm that matters most to avoid in trafficking: induced testimony,
re-victimization, and a case that collapses before the adjudicator. **Competent denial is the floor of
the system: an honest pass, not a loop** (ADR-034 §7).

---

## 5. Anti-gradient: what can be a table, is a table

An engineering principle that turned out to also be an ethical one.

Every time a language model is asked to resolve something that **could have been a structure**, two bad
things happen at once: the result becomes unstable — models collapse continua toward the simplest
category (ADR-034) — and the decision becomes **opaque**, because it stays inside the model instead of
being written down where someone can argue with it.

The operative criterion that organizes this is **operational monotonicity**: *a category exists if and
only if it triggers a distinct action*. It is a stronger test than any semantic argument. `partial` died
by that test: sometimes it meant "ask more", sometimes "let the attorney see it", sometimes "just a
note" — it had no action of its own, so it wasn't a category (ADR-035).

The sharpest architectural consequence is in how the model and the rules are separated (ADR-036):

- **The specialist does NOT consult rules.** It emits the state with its `basis`, its `source_question`,
  and its `source_answer` — a factual event about the intake.
- **The engine** — a separate layer — checks whether any human rule matches that `(question, answer)`
  pair and applies whatever that rule authorizes.

The model does not know which rules exist. That decoupling is what lets the same specialist serve firms
with different doctrines, and — more importantly — **keeps dispositive authority outside the language
model**, in a human, auditable entity.

Same principle in retrieval: the agent **does not guess where to look**. A deterministic map binds each
trigger to its exact source within the corpus, and *"an alias that isn't in the table isn't a route"*.
If a trigger has no row, the answer isn't to improvise the source — it is to declare the gap
(`retrieval/retrieval-map.md`).

Distilled into one line: **the LLM reads what cannot be structure; everything else is a table.**

The corollary is that the structure has to be built **for error, not for success**. Every AI output
carries undo, override (hand-editing it), and "mark as incorrect" — and that correction signal **is
persisted and feeds the evals**. The review rule is explicit about this: if the answer to any of those
is *"not needed, because the output is good"*, stop. **The output is going to fail; the only question
is when, and how the human corrects it** (`docs/snake-oil-filter.md`). A system with nowhere to record
its own error is not trustworthy: it is only silent.

---

## 6. Authority hierarchy and fidelity to the source

A legal system that cites badly is worse than one that doesn't cite at all.

Doctrinal claims are anchored in an explicit **authority hierarchy** — statute, regulation, agency
policy, case law — and the level **travels with the citation**: a district court ruling and a statute do
not carry the same weight, and the output must not flatten them.

### The hierarchy is a choice, and we show it

Here it is better to be transparent than to decree. **There is no single correct hierarchy we can hand
over pre-packaged**: the order depends on what it's used for, and every firm — every responsible
attorney — will have to **make it their own**. We chose ours and put it in plain sight, which is the only
honest thing to do with a decision that isn't universal.

Our choice is **two orderings for two different questions**, and conflating them is the error worth
avoiding:

| The question | The ordering we use | Why |
|---|---|---|
| **What governs as law?** (authority of the law) | statute → regulation → case law → agency policy | This is the hierarchy of sources of law. A policy manual does not outrank a court (ADR-034 §3) |
| **How will the adjudicator resolve this?** (the agent's consultation order) | statute → regulation → **agency policy** → persuasive case law | The agent assesses **how the agency would adjudicate**; its policy manual governs the adjudicator even though it does not govern a court. Cases **persuade, they do not command** (decision of 2026-08-19) |

The difference is not an inconsistency: it's that **"what is more authoritative" and "what better
predicts the decision we're anticipating" are different questions**, and a system that collapses them
will either cite well and predict badly, or the reverse.

That's why the package is designed so that **this choice is configurable, not baked in**. It's the same
logic that keeps dispositive rules outside the model (§5): if each firm's doctrine lives in human,
auditable entities, its consultation hierarchy should be able to live there too. A firm with a different
appetite, a different jurisdiction, or a different forum has to be able to order its sources differently
**without touching the engine** — and without silently inheriting someone else's choice.

Two disciplines sustain fidelity, and both were born from real errors:

**Verbatim against the raw source, not against the summary.** A central premise of the framework — that
a certain kind of harm was a categorical exclusion — turned out to be a **misreading of the source
itself**: the real text said *"generally… solely… totality"*, and the hardened reading had dropped those
three words. The closure didn't fall because of hierarchy; it fell from reading the original. Hence the
rule: **verbatim over paraphrase in every source that sustains a closure** (ADR-038). And its
uncomfortable corollary: when a correction like that surfaces, **it is retroactive** — every prior case
that relied on the corrected reading gets re-reviewed, not only the one that surfaced it.

**Hierarchy is an instrument for conflict, not a default explanation.** When two levels agree, what
resolves the question is the agreement, not the outranking. Hierarchy is not spent retroactively on
cases that had no conflict (ADR-038 §5).

On top of that, there's the real failure mode of legal RAG, and it isn't the one usually named: **it
isn't the fabricated citation** — a verified corpus covers that — **it's the real citation attached to a
provision that has since changed**. The antidote is treating currency as a first-class field
(`effective_date`), not as an assumption (ADR-036).

---

## 7. The method

The construction method is part of the product. A system whose thesis is "leave a trace" cannot be
built without leaving one.

**Auditability over perfection.** Not because correctness doesn't matter, but as a hierarchy for when
the two compete: between a system that looks more certain but is opaque and one that admits its
uncertainty but is traceable, the second is chosen. *"Perfection is a property one claims; auditability
is one that is offered. Perfection asks the other party to trust; auditability gives them the means to
verify and, if needed, to contradict"* (`docs/fundamento.md`). With its own caveat: the principle holds
when auditability *competes* with perfection, never when it *replaces* it. Using "well, it's auditable"
as an excuse not to fix a deficient rule inverts the principle.

**Partial objectivity.** Human domains are interpretable by nature, and that is not a flaw to be fixed
with more formalization. But interpretable is not relativist: there are sound readings and untenable
ones. Both alternatives would destroy the project — hard objectivism would end with the system deciding
(violating the seventh principle); relativism would make auditing pointless. The project lives in
between, and that is *"the most demanding of the three positions: whoever holds it carries the burden of
arguing which reading is better and why, knowing their argument is contestable"* (`docs/fundamento.md`).

**Authority comes from evidence that can be shown, not from the position one occupies.** It applies to
the specialist, to the rule, to the attorney — and to the exam itself. When the eval and the case
collide, **neither one retains a presumption of correctness**: the case is reopened and the evidence
decides. The presumption isn't lost automatically; it is lost **through work** (ADR-037 Rule 1). And
every correction to the ground truth carries the same auditable authorship the system demands of a
closure — *"without that trace, 'we audited the ground truth' becomes a euphemism for 'we adjusted the
exam'"* (ADR-037 Rule 3).

**Consensus is not a signal of truth.** Three independent analyses once converged on the same wrong
diagnosis because all three shared a hidden premise. The antidote is not a smarter analysis: it is going
to the **raw data** that would prove or break the premise everyone assumes. Discipline: **when everyone
agrees, make the shared premise explicit and check it against the primary data** (ADR-037 Rule 5).

### The AI mentor

This role wasn't designed in the abstract: **it was practiced first, formalized later, and named last.**

It began as a working practice in May 2026 — **dialectical** sessions where two different models acted
as **counterweights taking turns**, with the founder as the human filter. The rule that emerged from
that is the one holding up everything else: **reinforce the dialectical dynamic with a human filter, not
mutual validation between AIs.** Two models agreeing with each other don't produce truth; they produce a
blind spot with two witnesses.

That practice was formalized as an **orchestration role** with an explicit line of authority — who
verifies conformity and who decides — and today the founder gives it a name: **the AI mentor**.

It is a third role that sits above both the human and the executing AI, and whose function is neither
to produce work nor to approve it, but to **question both sides with epistemological and logical
rigor**.

- **To the human**: where does that premise come from? is it coherent with what you signed off on
  before? does that citation say what you say it says?
- **To the executing AI**: does this meet the spec, or does it just look like it does? is this evidence,
  or is it your report that evidence exists?

The operative distinction that makes the role useful: **verify against the source, not against the
report of whoever did the work.** An executor who says "I verified it" has verified nothing from the
system's point of view; verification exists when it can be shown against the data.

And its limit, which is the same as the rest of the building: **the mentor does not decide for either
of them.** It questions premises, demands evidence, names incoherences — and hands the decision back to
whoever it belongs to. Licensed humans decide.

It's worth saying why the role exists as a **role** and not as good intentions. Three written
disciplines hold it up, and all three were born from concrete errors:

- **Attack the shared premise.** When several analyses converge, consensus is not a signal of truth —
  it can be a shared blind spot. The discipline is to make explicit the premise everyone assumes and
  check it against the primary data (ADR-037 Rule 5).
- **Separate conformity from decision.** Verifying that a deliverable meets the spec and deciding
  whether the project adopts it are distinct acts, done by distinct hands. The mentor does the first and
  **never** the second.
- **Verify against real state, not against the report.** No executor — human or AI — establishes a fact
  by asserting it.

*(The line of authority and the verification rule are formalized in the project's orchestration
architecture document.)*

It closes on the same principle that opens everything: **the system captures, organizes, and shows its
work; licensed humans decide.** That line is not crossed for operational economy, volume pressure, or
accumulated trust in the tool.
