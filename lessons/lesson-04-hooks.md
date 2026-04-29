# Lesson 4 — Hooks (~10 min)

## Goal

Configure a **hook** that runs `node --test` automatically every time Copilot edits a file in this workspace. Watch tests run on every change without you asking.

## Why this customization exists

The first three customizations all shape **what the model says**: instructions guide it, agents specialize it, skills give it recipes. Hooks are categorically different: they shape **what your computer does in response to model actions**. They run shell commands deterministically on lifecycle events. They cannot be talked out of running.

A hook is a JSON file in `.github/hooks/` that maps a lifecycle event (e.g., `PostToolUse`) to a shell command. When the event fires, VS Code runs the command. The hook can return JSON to influence the agent (block, warn, inject context) — or just do its thing and exit.

**How it differs from the previous three:**

| | Instructions | Agents | Skills | **Hooks** |
| --- | --- | --- | --- | --- |
| Influences | Model output | Model output | Model output | **Real-world side effects** |
| Triggered by | Every chat | Agent selection | Description match / `/cmd` | **Lifecycle events** |
| Mechanism | Prompt prepending | Prompt + tools + handoffs | On-demand context | **Shell command** |
| Format | Markdown | Markdown w/ frontmatter | Markdown w/ frontmatter | **JSON** |

### Lifecycle events you can hook (8 total)

- `SessionStart` — start of a chat session
- `UserPromptSubmit` — user submits a prompt
- `PreToolUse` — before a tool runs (you can block or modify input!)
- **`PostToolUse`** — after a tool runs (we'll use this one)
- `Stop` — agent session ends
- `SubagentStart` / `SubagentStop` — subagent lifecycle
- `PreCompact` — before context compaction (good for saving state)

### Starting state

You finished lesson 3 with the filter feature. Verify:

```bash
ls .github/skills/add-todo-feature/SKILL.md
node --test 2>&1 | tail -3   # should show pass 8 or more
```

If anything's missing:

```bash
cp -R solutions/lesson-03-final/. .
```

---

## Phase 4A — Create the hook (~3 min)

### Step 4.1 — Create the hooks folder

```bash
mkdir -p .github/hooks
```

### Step 4.2 — Create the hook file

Right-click `.github/hooks/` → **New File** → name it **`run-tests.json`**. (The filename doesn't matter to VS Code — it loads all `*.json` files in this folder. We name it `run-tests.json` for clarity.)

Paste this content:

```json
{
  "$schema": "https://aka.ms/copilot-hooks-schema",
  "hooks": {
    "PostToolUse": [
      {
        "type": "command",
        "command": "node --test 2>&1 || true",
        "timeout": 30
      }
    ]
  }
}
```

**Save the file.** VS Code loads hooks immediately; no restart needed.

### Step 4.3 — Verify the hook is loaded

1. Right-click in the Chat view → **Diagnostics**.
2. Scroll to the **Hooks** section. You should see `run-tests.json` listed under **PostToolUse**.

If it doesn't appear:
- Verify path: `.github/hooks/run-tests.json`
- Verify the JSON is valid: paste into [jsonlint.com](https://jsonlint.com) or run `python3 -c "import json; json.load(open('.github/hooks/run-tests.json'))"`

### Step 4.4 — Open the Hooks output channel

1. Open the Output panel: **View → Output** (⇧⌘U / Ctrl+Shift+U).
2. From the dropdown on the right of the Output panel, select **GitHub Copilot Chat Hooks**.

Keep this panel visible. This is where every hook execution will be logged.

---

## Phase 4B — Trigger the hook (~5 min)

### Step 4.5 — Make a small edit via Copilot

In a new chat (any agent works), send:

```
In styles.css, change the accent color to a slightly darker blue. Just edit one line in the :root block.
```

Approve the edit. Watch the **GitHub Copilot Chat Hooks** output channel.

### Step 4.6 — Observe what fires

Within ~1 second of the edit, you should see in the Hooks output channel:

```
[Hook] PostToolUse: run-tests.json
[Hook] command: node --test 2>&1 || true
✔ createTodo trims text and starts incomplete (...)
✔ createTodo throws on empty input (...)
... (all the test results)
ℹ tests N
ℹ pass N
[Hook] exit code: 0
```

The hook ran your tests. The agent didn't have to know or care. The model could finish its turn while tests verified the change in parallel.

### Step 4.7 — Trigger a deliberate failure

This is the most instructive moment of the lesson. Send:

```
In state.js, change the deleteTodo function to also accidentally delete the *next* todo after the one matching the id. (We'll revert this in a moment — this is just to see the hook catch it.)
```

The agent will edit `state.js`. Watch the Hooks output channel. The `node --test` run should now report a failing test:

```
✖ deleteTodo removes the matching id (...)
  Error [ERR_ASSERTION]: ...
ℹ pass N-1
ℹ fail 1
[Hook] exit code: 0     ← still 0 because of `|| true`
```

The hook surfaced the regression in seconds. Now revert:

```
Revert that last change to state.js.
```

After the revert, the next hook firing should show all tests green again.

### Step 4.8 — Inspect why some tools fire and others don't

Most edits to `state.js` or `app.js` trigger the hook because Copilot uses an `editFiles` tool. Pure-chat exchanges (questions, explanations) won't trigger `PostToolUse` because no tool was invoked.

Try sending:

```
Explain what filterTodos does in plain English. Don't change any files.
```

The Hooks output channel should stay quiet. Hook fires on **tool use**, not on responses.

---

## Phase 4C — When *not* to use a hook (~2 min)

What goes wrong if we made the hook block on test failure (exit code 2 instead of `|| true`)?

The agent would see a failure mid-stream and likely try to "fix" the test, ending up in a loop. Blocking hooks are great for **policy** (e.g., "never let `rm -rf` run") and bad for **feedback** (the model can't see the change in flight, so it doesn't help to block).

Rule of thumb:
- Use **non-blocking hooks** (`|| true`) for **observability**: tests, formatters, linters, audit logs.
- Use **blocking hooks** (exit code 2) for **policy**: dangerous command bans, secret scanning, license checks.

---

## Self-check

- [ ] `.github/hooks/run-tests.json` exists and parses as valid JSON
- [ ] Diagnostics view shows the hook under `PostToolUse`
- [ ] **GitHub Copilot Chat Hooks** output channel exists in the Output dropdown
- [ ] At least one Copilot edit triggered the hook visibly
- [ ] The deliberate-failure step showed a red test in the hook output
- [ ] After revert, tests went back to green

If everything is checked — congratulations, you've finished the core 60-minute workshop. You now have hands-on experience with all four primary Copilot customization layers.

## Common pitfalls

| Symptom | Fix |
| --- | --- |
| Hook never fires | Check **Diagnostics** for parse errors; make sure file is `*.json` and in `.github/hooks/` |
| Hook output channel is empty | You're looking at "GitHub Copilot Chat" instead of "GitHub Copilot Chat Hooks". Switch dropdown. |
| Agent stops every time the hook fires | You forgot `|| true` and a test is failing. Either fix the test or add `|| true` to make the hook non-blocking. |
| Hook fires multiple times per edit | Normal — `PostToolUse` fires once per tool call, and a single chat turn can use several tools |
| `node --test` says "no test files found" | You're at the wrong directory; the hook runs from the workspace root |
| Tests run unbearably slow | Reduce scope: change `node --test` to `node --test state.test.js` — but for this workshop the suite is fast |

## Stretch (if time)

### A. Add a `SessionStart` hook that injects context

Edit `.github/hooks/run-tests.json` (or add a new file) to also include:

```json
"SessionStart": [
  {
    "type": "command",
    "command": "echo '{\"hookSpecificOutput\":{\"hookEventName\":\"SessionStart\",\"additionalContext\":\"You are working on a vanilla-JS to-do app. No frameworks. No build tools. Always run node --test before stopping.\"}}'"
  }
]
```

When you start a new chat, this string is injected into the agent's context — like a per-session instruction stamp.

### B. Add a `PreToolUse` policy hook (advanced)

Block the agent from running `rm` commands, regardless of how it's prompted:

```json
"PreToolUse": [
  {
    "type": "command",
    "command": "node -e \"const i=JSON.parse(require('fs').readFileSync(0,'utf8'));const cmd=(i.tool_input&&i.tool_input.command)||'';if(cmd.includes('rm ')||cmd.includes('rm -')){process.stdout.write(JSON.stringify({hookSpecificOutput:{hookEventName:'PreToolUse',permissionDecision:'deny',permissionDecisionReason:'rm commands are blocked by policy'}}));}else{process.stdout.write(JSON.stringify({hookSpecificOutput:{hookEventName:'PreToolUse',permissionDecision:'allow'}}));}\""
  }
]
```

Test by asking Copilot to "delete the README.md file" — the hook will block.

## Recap

You now have all four core customizations layered together:

- **`copilot-instructions.md`** — what every prompt should respect
- **Custom agents with handoff** — specialized personas with guided workflows
- **Skills** — recipes loaded on demand
- **Hooks** — deterministic side effects on lifecycle events

That's the workshop. If you have time, the [bonus track](bonus-01-copilot-cli.md) covers Copilot CLI, prompt files, a reviewer agent, framework conversion via multi-agent handoff, and a cheat-sheet of advanced customizations.
