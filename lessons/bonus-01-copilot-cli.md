# Bonus 1 — GitHub Copilot CLI

## Goal

Install the **GitHub Copilot CLI** and use it to perform the same kind of customization-aware tasks you just did in VS Code — from your terminal, with no editor open.

## Why this is interesting for advanced users

VS Code's Chat view is one face of GitHub Copilot. The CLI is the other. The CLI:

- Runs anywhere with a terminal — over SSH, in CI, in a tmux session.
- Shares **the same customizations** as VS Code: `copilot-instructions.md`, `AGENTS.md`, `.github/agents/*.agent.md`, `.github/skills/`, `.github/hooks/`, `.github/prompts/`.
- Has both an **interactive** mode (`copilot`) and a **programmatic** mode (`copilot -p "prompt"`) — the latter is what makes it scriptable.

> If you put effort into building a `.github/` folder of customizations, the CLI lets you reuse it from cron jobs, git hooks, CI pipelines, and other automation — not just chat sessions.

---

## 1. Install

You need **Node.js 22+**. The simplest install is npm:

```bash
npm install -g @github/copilot
```

Alternatives:
- macOS / Linux: `brew install copilot-cli`
- macOS / Linux script: `curl -fsSL https://gh.io/copilot-install | bash`
- Windows: `winget install GitHub.Copilot`

Verify:

```bash
copilot --version
```

## 2. Authenticate

Start the CLI and sign in:

```bash
copilot
```

On first run, it asks you to type `/login`. Do that and follow the device-code prompt in your browser. After that, the CLI is authenticated for all future sessions on this machine.

To exit the interactive session at any time, press **Ctrl+D** or type `/exit`.

## 3. Confirm trust for the workshop folder

`cd` into the workshop folder and start `copilot`:

```bash
cd ~/copilot-workshop
copilot
```

The CLI will prompt you to confirm you trust the directory — type **y**. (Do **not** trust your home directory or any folder containing files you wouldn't want modified.)

## 4. Try it interactively — your customizations apply

In the interactive prompt, send:

```
What customizations are configured in this workspace? Just list them.
```

You should see the CLI list `copilot-instructions.md`, your two agents, the skill, and the hook — all the things you built in lessons 1–4. The CLI discovered the same `.github/` folder VS Code did.

Then try a real edit:

```
Add a "Clear all" button next to the filters that removes every todo.
```

Watch what happens:
- The CLI will ask for permission before each tool use (file read, file edit, terminal command). Type `1` for *Yes* to each prompt.
- Because the **skill** auto-loads, the CLI follows the same recipe: pure function in `state.js`, DOM wiring in `app.js`, tests in `state.test.js`.
- Because the **hook** is configured, `node --test` runs after each edit — you'll see test output in your terminal, just like in VS Code.

> **Same customizations, same behavior, different surface.** That's the point.

## 5. Try it programmatically (the magic)

The programmatic interface is what makes the CLI different from the Chat view. Quit the interactive session (Ctrl+D), then from the same directory:

```bash
copilot -p "Audit state.js: are all exported functions pure (no DOM, no localStorage, no Date.now() reads)? List any violations." --allow-tool='shell(cat)' --allow-tool='shell(grep)'
```

The CLI runs **once**, completes the task, prints the answer, and exits. No interactive session.

Why this matters: you can drop this into a git pre-commit hook, a CI job, a slack-bot trigger — anything that can run a shell command.

## 6. Reuse a custom agent from the CLI (experimental)

You can ask the CLI to run with one of your custom agents (`.github/agents/feature-builder.agent.md`):

In an interactive session:

```
/agent feature-builder
```

(or set the `github.copilot.chat.cli.customAgents.enabled` setting in VS Code if calling from the editor's CLI integration.)

The agent's tool restrictions and persona apply for the rest of the session, exactly like in VS Code.

## 7. Use `/compact` to manage long sessions

The CLI auto-compacts at ~95% of token budget, but you can force it manually:

```
/compact
```

The session continues with a summarized history. Useful for long tasks where you don't want to start a fresh session.

## 8. Allow-tool flags worth remembering

In programmatic mode you'll often want to skip permission prompts:

| Flag | Effect |
| --- | --- |
| `--allow-tool='shell(git)'` | Auto-approve any `git` shell command |
| `--allow-tool='shell(node)'` | Auto-approve any `node` command |
| `--allow-tool='write'` | Auto-approve file edits |
| `--allow-all-tools` | Auto-approve **everything** (caution!) |
| `--deny-tool='shell(rm)'` | Always block `rm`, even with `--allow-all-tools` |

A safer pattern for automation:

```bash
copilot -p "Run the test suite and summarize failures" \
  --allow-tool='shell(node)' \
  --deny-tool='shell(rm)' \
  --deny-tool='shell(git push)'
```

## Self-check

- [ ] `copilot --version` prints a version
- [ ] You ran an interactive prompt successfully
- [ ] You ran `copilot -p "..."` non-interactively
- [ ] Your hook fired during the CLI session (test output visible in terminal)
- [ ] You used `/compact` at least once

## Where to go next

- Authenticate with a fine-grained PAT for headless automation: https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli#authenticating-with-a-personal-access-token
- Use Copilot CLI in CI: gate PR merges on a Copilot-driven diff review
- Background sessions: VS Code can hand off a chat to a Copilot CLI background session for long tasks; see https://code.visualstudio.com/docs/copilot/agents/copilot-cli
