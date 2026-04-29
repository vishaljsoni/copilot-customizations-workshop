# Setup (~5 minutes)

Do this **before** the breakout starts.

## 1. Required software

| Tool | Minimum version | How to check |
| --- | --- | --- |
| VS Code | 1.105 (April 2026) | `code --version` |
| Node.js | 22 LTS | `node --version` |
| Git | any recent | `git --version` |

If anything is missing:
- **VS Code** — https://code.visualstudio.com/download
- **Node.js 22+** — https://nodejs.org/ or `brew install node@22` / `nvm install 22`
- **Git** — `brew install git` / `apt install git`

## 2. GitHub Copilot subscription

You need an active Copilot subscription (Free, Pro, Pro+, Business, or Enterprise). Verify at https://github.com/settings/copilot.

In VS Code:
1. Open the **Chat** view (⌃⌘I on macOS / Ctrl+Alt+I on Windows/Linux).
2. If prompted, sign in with the GitHub account that has Copilot.
3. The status bar should show the Copilot icon without a slash through it.

## 3. Enable the agent and customizations

The breakout uses **Agent mode**, **custom agents**, **skills**, and **hooks** (preview). Confirm these settings in `Settings` (⌘,):

| Setting | Required value |
| --- | --- |
| `chat.agent.enabled` | `true` |
| `chat.useAgentsMdFile` | `true` (default) |
| `chat.useCustomAgentHooks` | `true` *(needed for Bonus 3)* |

You can paste this into your `settings.json` directly:

```json
{
  "chat.agent.enabled": true,
  "chat.useAgentsMdFile": true,
  "chat.useCustomAgentHooks": true
}
```

## 4. Open this repo as your workspace

```bash
git clone <this-repo-url> copilot-workshop
cd copilot-workshop
code .
```

Trust the workspace when VS Code prompts you. **Do not** run `npm install` — this workshop has no runtime dependencies.

## 5. 60-second smoke test

The workshop assumes Copilot agent mode works. Confirm now so problems surface before the breakout.

1. Open the **Chat** view (⌃⌘I).
2. From the agent dropdown at the bottom of the chat input, select **Agent**.
3. Send this prompt:

> Reply with the single word READY and nothing else.

You should see `READY` (case may vary) appear in the chat as Copilot's reply, with no tools invoked. If you see an authentication prompt, sign in. If you see a quota error, check your Copilot plan.

## 6. Verify Node tests run

From the repo root:

```bash
cd solutions/lesson-04-final
node --test
```

You should see `ℹ pass 8`. Then return to the repo root:

```bash
cd ../..
```

## You are ready

If the smoke test reply was `READY` and `node --test` printed 8 passes, you are set. Open [`README.md`](README.md) and head into [Lesson 1](lessons/lesson-01-copilot-instructions.md) when the breakout starts.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Chat says "Sign in to GitHub" | Click the prompt; complete OAuth in browser |
| Smoke-test reply is empty or errors | Check Copilot plan at github.com/settings/copilot |
| Agent dropdown missing | Update VS Code; ensure `chat.agent.enabled` is `true` |
| `node --test` says "unknown option" | You're on Node < 22. Upgrade. |
| Chat customizations don't load | Right-click in Chat view → **Diagnostics** to see errors |
