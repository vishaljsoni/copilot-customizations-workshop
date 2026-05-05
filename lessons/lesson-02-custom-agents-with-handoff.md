# Lesson 2 — Custom Agents with Handoff (~20 min)

## Goal

Create two custom agents — `feature-builder` and `tester` — and use them to add **localStorage persistence** and **tests** to the to-do app via an explicit **handoff** between them.

## Why this customization exists

`copilot-instructions.md` (lesson 1) applies the *same* rules to every chat. But real teams have different workflows for different tasks: one mode for shipping features, another for review, another for planning.

A **custom agent** is a persona stored in `.github/agents/<name>.agent.md`. Each agent has:
- Its own **instructions** (the persona's job description)
- Its own **tools** allowlist (security: a planning agent can't accidentally edit files)
- Optional **handoffs** to other agents (after this agent finishes, suggest moving to that one)
- Optional model preference

**How it differs from `copilot-instructions.md`:** Repo-wide instructions always apply. Agents are *modes* you switch into. You opt in by picking the agent from the dropdown — and once you're in it, only that agent's tools and persona are active. Handoffs turn a one-shot conversation into a guided multi-step workflow with a review point at each handoff.

### Starting state

You finished lesson 1 with these files:
- `index.html`, `styles.css`, `state.js`, `app.js`
- `.github/copilot-instructions.md`

If you fell behind, recover now from the repo root:

```bash
cp -R solutions/lesson-01-final/. .
```

---

## Phase 2A — Create the two agents (~6 min)

### Step 2.1 — Create the `agents` folder

In the integrated terminal:

```bash
mkdir -p .github/agents
```

### Step 2.2 — Create `feature-builder.agent.md`

In the Explorer, right-click `.github/agents/` → **New File** → name it **`feature-builder.agent.md`** (the `.agent.md` extension is required for VS Code to detect it).

Paste this content exactly:

```markdown
---
description: Implement a to-do app feature end-to-end (state + DOM), then hand off to the tester.
tools: ['edit', 'codebase', 'search', 'usages', 'problems', 'runCommands', 'runTasks']
handoffs:
  - label: Hand off to Tester
    agent: tester
    prompt: |
      Add or update tests in `state.test.js` to cover the feature I just implemented.
      Run `node --test` and confirm all tests pass. If any fail, fix the test (not the source) only when the test itself is wrong; otherwise stop and report.
    send: true
---

# Feature Builder

You implement features for a vanilla-JS to-do app. Follow `.github/copilot-instructions.md` strictly.

## How you work
1. Read the user's request. If it mentions state behavior (create/toggle/delete/filter/persist), put that logic in `state.js` as a **pure** exported function.
2. Wire the DOM in `app.js`. Import from `./state.js`. Never duplicate state logic into `app.js`.
3. Update `index.html` and `styles.css` only when the feature requires new markup or styling. Use BEM and semantic HTML.
4. **Do not write tests yourself.** When the implementation is complete and you have run/edited the relevant files, hand off to the `tester` agent using the handoff button.

## Hard rules
- No frameworks, no build tools, no bundlers, no CSS preprocessors.
- No npm runtime dependencies. Do not run `npm install <pkg>`.
- No inline styles, no `!important`.
- Every new pure function in `state.js` must have a clear JSDoc signature.

## What "done" looks like
- The app loads in a browser with no console errors.
- `state.js` exports remain pure (no DOM, no `localStorage` calls).
- The handoff to `tester` is initiated.
```

Save the file.

### Step 2.3 — Create `tester.agent.md`

In the same `.github/agents/` folder, create **`tester.agent.md`**:

```markdown
---
description: Write and run tests for pure state functions in state.js using node --test.
tools: ['edit', 'codebase', 'search', 'usages', 'problems', 'runCommands']
handoffs:
  - label: Back to Feature Builder
    agent: feature-builder
    prompt: |
      Tests pass. If there is more functionality to build, continue. Otherwise summarize what was completed.
    send: false
---

# Tester

You write tests for the to-do app's pure state functions and run them.

## How you work
1. Open `state.js` and identify exported functions that lack coverage in `state.test.js`.
2. Add tests using **only** `node:test` and `node:assert/strict`. No external test frameworks.
3. Tests must be deterministic: pass an explicit `now` value to any helper that takes one.
4. Run the tests in the integrated terminal: `node --test`.
5. If a test fails:
   - If the test is wrong, fix the test.
   - If the source is wrong, **do not modify it**. Report the failure and hand back to `feature-builder`.
6. When all tests pass, offer the handoff back to `feature-builder`.

## Hard rules
- Test files are named `*.test.js` and live next to the file under test.
- Never modify `app.js`, `index.html`, or `styles.css`. You only touch `state.js`'s tests (and `state.js` itself only if a test exposes a clear bug).
- Do not add a test runner package. `node --test` is the only test runner.
```

Save the file.

### Step 2.4 — Confirm both agents are detected

1. Click the **agent dropdown** at the bottom of the Chat view.
2. You should see **Feature Builder** and **Tester** listed alongside the built-in agents.
3. If they don't appear:
   - Verify file paths: `.github/agents/feature-builder.agent.md` and `.github/agents/tester.agent.md`.
   - Verify the `.agent.md` extension (not `.md`).
   - Right-click in the Chat view → **Diagnostics**; check for parse errors.

---

## Phase 2B — Add localStorage via the agent flow (~10 min)

### Step 2.5 — Switch to Feature Builder and prompt

1. In the Chat view, **start a new chat session** (New Chat icon).
2. From the agent dropdown, select **Feature Builder**.
3. Send this prompt:

```
Add localStorage persistence so todos survive page refresh. Save on every change, load on page load. Use the storage key "copilot-workshop.todos.v1".
```

### Step 2.6 — Watch what happens

The agent should:
- Edit `app.js` only (NOT `state.js` — persistence is a side effect, not pure state).
- Add a `STORAGE_KEY` constant.
- Add `loadTodos()` and `saveTodos()` functions in `app.js`.
- Wrap `localStorage` calls in `try/catch` (defensive — quota errors, private mode).
- After completion, show a **"Hand off to Tester"** button.

If `state.js` was modified — **stop and re-prompt**:

```
Revert any changes to state.js. localStorage belongs in app.js only because state.js must stay pure.
```

### Step 2.7 — Click the handoff button

When you see **"Hand off to Tester"** appear under the agent's response, **click it**. Because `send: true` is in the frontmatter, the prompt auto-submits to the Tester agent.

### Step 2.8 — Watch the Tester run

The Tester agent should:
- Notice there's no `state.test.js` yet, or that some functions lack coverage.
- Create or update `state.test.js` with `node:test` style tests.
- Create a `package.json` with `"type": "module"` so ESM imports work in Node (required for tests).
- Run `node --test` in the integrated terminal.
- Report all tests passing.
- Offer a "Back to Feature Builder" button (because `send: false`, this just pre-fills the next prompt).

If tests fail because the agent created `package.json` without `"type": "module"`:

```
state.js uses `export` syntax. Add "type": "module" to package.json so Node can run ESM tests, then re-run.
```

### Step 2.9 — Verify the result

In the terminal at the repo root:

```bash
node --test
```

You should see all tests pass (output ends with `ℹ pass N`, with N ≥ 4).

From the integrated terminal, serve the app:

```bash
npx serve .
```

Open the URL shown in the terminal (usually **http://localhost:3000**). Add a task. Refresh the page. The task should still be there.

Press **Ctrl+C** to stop the server when done.

---

## Phase 2C — Why we did this (~3 min)

> **Before moving on, reflect:**
> - Could one general-purpose agent have done all this in one prompt? Yes.
> - Why is splitting it better? Three reasons:
>   1. **Tool restrictions are scoped.** The Tester literally cannot edit `index.html`. Mistakes are bounded.
>   2. **Review at handoff.** You see the implementation before tests are written. If something looks wrong, you fix it before tests cement the wrong behavior.
>   3. **Agents are reusable.** Tomorrow you can run Feature Builder against any new feature. Today's flow is repeatable.

### Optional: explore one more handoff round

Click **Back to Feature Builder**, edit the pre-filled prompt to:

```
Add a counter at the top showing "X tasks remaining" (only the active ones).
```

Submit. Watch Feature Builder add the counter, then hand off to Tester, who covers the new counting logic. Two-round flow with two natural review points.

---

## Self-check

- [ ] `.github/agents/feature-builder.agent.md` exists with frontmatter
- [ ] `.github/agents/tester.agent.md` exists with frontmatter
- [ ] Both appear in the agent dropdown
- [ ] `state.test.js` exists at the repo root
- [ ] `package.json` has `"type": "module"`
- [ ] `node --test` shows all tests passing
- [ ] Tasks persist across browser refresh
- [ ] You clicked at least one handoff button

If everything is checked, onward to [Lesson 3 →](lesson-03-skills.md).

## Common pitfalls

| Symptom | Fix |
| --- | --- |
| Agents don't appear in dropdown | Wrong path or extension; must be `.github/agents/<name>.agent.md` |
| Handoff button never appears | Agent didn't reach a "done" state; reply with "are you done?" or check the agent's response for an obvious early stop |
| Feature Builder edited `state.js` to add localStorage | Re-prompt: "Revert that. `state.js` is pure; localStorage belongs in app.js." |
| Tester says "I can't run tests" | Tools whitelist excludes `runCommands`; check the frontmatter |
| `node --test` says "Cannot use import" | Missing `"type": "module"` in `package.json` |
| Tests fail with "import not found" | Test file imports `./state.js` — check the relative path |
| Both handoffs go in circles | Hit the **Stop** button; you've shown the loop, that's enough for the lesson |

## Stretch (if time)

Add a third agent — `planner` — that has only **read-only** tools and produces an implementation plan, then hands off to `feature-builder`. Try the chain `Plan → Implement → Test`.

```markdown
---
description: Read-only planner; produces implementation plans without editing code.
tools: ['codebase', 'search', 'usages']
handoffs:
  - label: Start Implementation
    agent: feature-builder
    prompt: Implement the plan above. Follow `.github/copilot-instructions.md` strictly.
    send: false
---

# Planner

You are a read-only planning agent. Your output is a numbered implementation plan with file paths, function signatures, and edge cases. You never edit files.
```

## Recap

You created two custom agents and watched a real handoff connect them. The next lesson introduces a third type of customization — **skills** — which are how you teach Copilot a *recipe* it can pull off the shelf when needed, instead of always-on rules or always-on personas.
