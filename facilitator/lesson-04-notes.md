# Facilitator notes — Lesson 4 (Hooks)

Use these alongside [`../lessons/lesson-04-hooks.md`](../lessons/lesson-04-hooks.md). Each note is anchored to a specific section of the lesson — deliver it at that point.

---

## After the comparison table in "Why this customization exists"

Read the table aloud. Then say:

> *"This is the one customization where the model has zero say. The hook fires whether the model wants it to or not. That's exactly why you use hooks for security policies, audit logging, formatters, and — what we're about to do — fast feedback on every edit."*

---

## After Step 4.2 — saving the `run-tests.json` hook

Three callouts:

1. *"`PostToolUse` fires after **any** tool — file edits, file creates, terminal commands. We're casting a wide net here for the demo. Production setups usually filter by tool name in the script."*
2. *"`|| true` makes the hook always exit 0 — a non-zero exit code 2 would block the agent. We just want to *show* test results, not block."*
3. *"`timeout: 30` is in seconds. Default is 30 anyway, but writing it makes intent clear."*

---

## After Step 4.4 — opening the GitHub Copilot Chat Hooks output channel

> *"Keep this panel on screen for the rest of the lesson. Watching the hook fire is the entire payoff — don't miss it."*

---

## After Step 4.6 — observing the hook fire on a real edit

> *"This is the moment. Every change Copilot makes is now verified by your test suite — without you asking, without the model knowing. If a test breaks, you see it before the agent finishes its next response."*

---

## After Step 4.7 — the deliberate-failure demo and revert

> *"In a real workflow, this is your safety net. Copilot suggests something subtle, your tests catch it, you revert in one prompt. Compare to: ship the change → user reports bug → reproduce → debug → fix. Hooks compress that loop to seconds."*

---

## Phase 4C — "When *not* to use a hook"

Quick discussion. Ask:

> *"What goes wrong if we made the hook block on test failure (exit code 2 instead of `|| true`)?"*

Answer: the agent would see a failure mid-stream and likely try to "fix" the test, ending up in a loop. Blocking hooks are great for **policy** (e.g., "never let `rm -rf` run") and bad for **feedback** (the model can't see the change in flight, so it doesn't help to block).

Rule of thumb:

- Use **non-blocking hooks** (`|| true`) for **observability**: tests, formatters, linters, audit logs.
- Use **blocking hooks** (exit code 2) for **policy**: dangerous command bans, secret scanning, license checks.
