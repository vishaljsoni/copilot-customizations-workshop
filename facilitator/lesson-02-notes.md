# Facilitator notes — Lesson 2 (Custom Agents with Handoff)

Use these alongside [`../lessons/lesson-02-custom-agents-with-handoff.md`](../lessons/lesson-02-custom-agents-with-handoff.md). Each note is anchored to a specific section of the lesson — deliver it at that point.

---

## After reading "Why this customization exists"

Read the "Why" aloud. Then say:

> *"Specialized agents do their thing well. Handoff turns serial work into a review-as-you-go flow. Watch how the model 'finishes' but offers a button to continue with a different persona — that's the highest-value moment in this whole workshop."*

Project chat panel + file explorer.

---

## After Step 2.2 — saving `feature-builder.agent.md`

Briefly call out three frontmatter fields:

- `description` — shown in the agent dropdown.
- `tools` — whitelist; this agent can edit and run commands but **not** create new agents or fetch web.
- `handoffs` — the button shown after the agent finishes.

Mention that `send: true` auto-submits the next agent's prompt — `false` would just pre-fill it for the user to review.

---

## After Step 2.3 — saving `tester.agent.md`

> *"Notice this agent's tools are slightly narrower (no `runTasks`). It can read code, edit tests, and run `node --test` in the terminal — and that's it. The handoff back to feature-builder uses `send: false`, meaning the user gets to review and approve before the next round starts."*

---

## After Step 2.7 — clicking the handoff button (THE moment)

This is *the* moment to slow down. Say:

> *"What just happened? The first agent finished, knew its job was done, and offered a button to switch personas with a pre-filled prompt. We didn't write any orchestration code. The handoff is declarative — it's data in the agent file."*

---

## Phase 2C — "Why we did this"

Before moving on, ask the room:

- *"Could one general-purpose agent have done all this in one prompt?"* — Yes.
- *"Why is splitting it better?"* — Three reasons:
  1. **Tool restrictions are scoped.** The Tester literally cannot edit `index.html`. Mistakes are bounded.
  2. **Review at handoff.** You see the implementation before tests are written. If something looks wrong, you fix it before tests cement the wrong behavior.
  3. **Agents are reusable.** Tomorrow you can run Feature Builder against any new feature. Today's flow is repeatable.
