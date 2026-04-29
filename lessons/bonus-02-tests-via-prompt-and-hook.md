# Bonus 2 — Tests via Prompt File + Hook

## Goal

Build a one-shot **prompt file** (`/add-test`) for generating test coverage, then chain it with a **hook** so tests automatically run when the prompt completes.

## Why this is interesting

You've seen instructions, agents, skills, and hooks. You haven't yet seen **prompt files**. They are the lightest-weight customization Copilot offers:

- **Instructions** = always loaded
- **Skills** = loaded when relevant (description match)
- **Prompt files** = loaded only when **explicitly invoked** by `/name`

A prompt file is a `.prompt.md` with frontmatter (`description`, optional `agent`, `tools`, `model`) and a Markdown body. Typing `/name` in chat sends the body as if you'd typed it yourself.

> **When to prefer a prompt file over a skill:**
> - Skill: "When the user asks for X, here's the recipe." Auto-discovery matters.
> - Prompt file: "I run this exact thing 5x a week. Don't try to be clever — just do it."

Combining a prompt file with a hook gives you a one-key workflow: type `/add-test`, watch tests get generated and verified.

---

## 1. Create the prompt file

```bash
mkdir -p .github/prompts
```

Create **`.github/prompts/add-test.prompt.md`**:

```markdown
---
description: Generate node:test tests for any uncovered exported function in state.js.
agent: agent
tools: ['edit', 'codebase', 'search', 'usages', 'runCommands']
---

# Add tests for `state.js`

Look at every function exported from `state.js`. For each one not already tested in `state.test.js`, write at least:
- One happy-path test
- One edge case (empty input, single item, missing id, etc.)

Then run `node --test`. If all tests pass, summarize what was added. If any fail, do **not** modify the source — just report the failure.

Constraints:
- Only `node:test` and `node:assert/strict`. No external test frameworks.
- Pass an explicit `now` value to `createTodo` for deterministic ids.
- Place new tests at the end of the existing test file. Do not reorder existing tests.
```

Save.

## 2. Confirm Copilot detected it

In Chat, type `/`. You should see **`/add-test`** in the slash-command list.

## 3. Add a hook scoped to the prompt's run

You already have a `PostToolUse` hook from lesson 4 that runs `node --test` after every tool. We want a **`Stop`** hook that fires once when the prompt finishes, summarizing test results.

Create **`.github/hooks/post-test-stop.json`**:

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "command",
        "command": "echo '------ Final test run ------' && node --test 2>&1 | tail -10",
        "timeout": 30
      }
    ]
  }
}
```

Save.

> **Why `Stop` and not `PostToolUse`?** `PostToolUse` fires after each tool call — sometimes 5+ times per turn. `Stop` fires once when the agent considers itself done. Use `Stop` for end-of-task summaries.

## 4. Use the prompt + hook together

Pretend you have a new uncovered function — add one quickly to `state.js`:

```javascript
/** @param {Todo[]} todos @returns {number} */
export function countActive(todos) {
  return todos.filter((t) => !t.completed).length;
}
```

Save. Now in chat:

```
/add-test
```

Watch:
1. Copilot loads your prompt body, sees `state.js` has a `countActive` not yet tested.
2. It writes 2+ tests for `countActive` in `state.test.js`.
3. `PostToolUse` (lesson 4 hook) fires after the file edit — tests run.
4. Copilot reports done.
5. **`Stop` hook** fires — your "Final test run" message appears in the Hooks output channel.

## 5. Argument hints (a small but useful detail)

Frontmatter supports `argument-hint`:

```markdown
---
description: Generate node:test tests for a specific function in state.js.
argument-hint: <function-name>
agent: agent
---

# Add tests for `${input:functionName}`

Generate happy-path + edge-case tests for the exported function `${input:functionName}` from `state.js`. Run `node --test` afterward.
```

Now `/add-test countActive` triggers the prompt with `${input:functionName}` substituted. This is the cleanest way to make prompt files **parameterized**.

## Self-check

- [ ] `.github/prompts/add-test.prompt.md` exists and shows up in the `/` menu
- [ ] `/add-test` produces real tests for any uncovered function
- [ ] Both your `PostToolUse` (per-edit) and `Stop` (end-of-turn) hooks fired during a single `/add-test` run
- [ ] Tests pass after the prompt completes

## Stretch

Combine prompt + skill: invoke `/add-test` from inside the body of a skill so the skill's recipe automatically calls out to the test generator at step 4. Skills referencing prompt files (or vice-versa) is how you build durable workflows out of small reusable pieces.
