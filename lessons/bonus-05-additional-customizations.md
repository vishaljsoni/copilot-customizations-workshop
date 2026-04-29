# Bonus 5 — Customizations You Probably Haven't Used

A reference cheat-sheet for advanced customizations beyond the four covered in the core workshop. Each entry has a one-paragraph "what + when" plus a tiny example.

> Use this as a menu, not a checklist. Pick one or two that solve a real problem in your repo.

---

## 1. Scoped `.instructions.md` files (with `applyTo`)

`copilot-instructions.md` (lesson 1) is global to the workspace. **`.instructions.md`** files are scoped to specific files via a glob pattern.

**When to use:** Mixed-tech repos. Different rules for `*.test.js` vs `src/**/*.tsx` vs `*.css`.

**Where:** `.github/instructions/<name>.instructions.md`

**Example: `.github/instructions/tests.instructions.md`**

```markdown
---
description: Conventions for test files
applyTo: '**/*.test.js'
---
- Use the AAA pattern (Arrange, Act, Assert) with blank-line separators inside each test.
- Prefer `assert.deepEqual` over comparing JSON.stringify output.
- Test names start with the function under test, not "should".
```

When Copilot is editing a `*.test.js` file, this is automatically loaded — but only then. No bloat for non-test work.

**Decision rule:** if the rule applies to >80% of the codebase, use `copilot-instructions.md`. Else use scoped `.instructions.md`.

---

## 2. `AGENTS.md` (cross-tool always-on instructions)

`AGENTS.md` is functionally identical to `copilot-instructions.md` — but it's a **shared standard** also recognized by Claude Code, Cursor, and other agentic tools that follow the [agent.md convention](https://agent.md).

**When to use:** Your team uses multiple AI tools, and you want one source of truth for project rules.

**Where:** `AGENTS.md` at the repo root.

If you have **both** files, both apply. If you're only using GitHub Copilot, prefer `copilot-instructions.md` — it's the documented "primary" location for VS Code and is more discoverable.

The experimental `chat.useNestedAgentsMdFiles` setting allows multiple `AGENTS.md` files in subfolders for monorepos — `apps/web/AGENTS.md` separately from `apps/api/AGENTS.md`.

---

## 3. Custom prompt files (already covered in Bonus 2)

Quick recap: `.github/prompts/<name>.prompt.md` invokable as `/name`. Frontmatter supports `description`, `agent`, `tools`, `model`, `argument-hint`.

**When to prefer over a skill:**
- The task is **always** the same — no variation needed.
- You want the user to consciously trigger it (`/cmd`), not have Copilot decide.
- Lighter than skills (no folder, no `name`-must-match-folder rule).

**When to prefer over a custom agent:**
- It's a one-shot task, not an ongoing persona.
- You don't need different tool restrictions than your default agent.

---

## 4. `/compact` — manage long conversations

After a long agent session, the context window fills up. **`/compact`** asks Copilot to summarize the conversation so far, replace the long history with the summary, and continue.

**When to use it:**
- Long debugging sessions where most of the chat is irrelevant tangents
- Before starting a new sub-task in the same conversation
- After a big refactor when you want to preserve "what happened" without "every diff"

**Where:** Type `/compact` in the chat input field.

**Pair with:** A `PreCompact` hook (lesson 4 events list) that exports the pre-compact transcript to disk — you keep the full history as a file, while the live session shrinks.

---

## 5. `/review` — code review without leaving the editor

Built-in slash command. Selects the current changes (or selection) and produces a structured code review. You can customize what the review looks for via the `github.copilot.chat.reviewSelection.instructions` setting.

**When to use:**
- Pre-PR sanity check
- Reviewing your own old code
- Quick audit when you're not in the mood for the full reviewer-agent flow (Bonus 3)

**Customize via `settings.json`:**

```json
"github.copilot.chat.reviewSelection.instructions": [
  { "text": "Flag any localStorage write that isn't wrapped in try/catch." },
  { "file": ".github/instructions/security.instructions.md" }
]
```

The `file` form lets you point at a markdown file you already maintain — no duplication.

---

## 6. MCP servers (external tools and data)

**MCP** = Model Context Protocol. An **MCP server** exposes tools/data to Copilot via a standard protocol. Examples:

- **Playwright** — Copilot can drive a real browser to take screenshots, click, fill forms.
- **GitHub** — query issues, PRs, files across your org.
- **Postgres / SQLite** — read query results directly.
- **Filesystem** (sandboxed) — operate on a specific folder.

**When to use:**
- Your task needs data Copilot can't reach via chat (live DB, live API, real browser state).
- You want to extend Copilot's tool catalog without writing a VS Code extension.

**Where:** Configure in VS Code settings under **Chat: MCP Servers**, or browse from the **Chat Customizations editor → MCP Servers** tab. Many are one click to install.

**Use with care:** MCP servers are external processes that can read/write things. Audit before installing.

---

## When-to-use Decision Matrix

You have a thing you want Copilot to do better. Which customization?

| You want to... | Use |
| --- | --- |
| Apply a rule to *every* prompt in this repo | `copilot-instructions.md` |
| Apply a rule only to certain files | `.instructions.md` w/ `applyTo` |
| Share rules across Copilot + Claude + Cursor | `AGENTS.md` |
| Define a *persona* (planner, reviewer, security auditor) | Custom agent (`.agent.md`) |
| Create a guided multi-step workflow | Custom agents + `handoffs` |
| Codify "when user asks X, do Y" | Skill (`SKILL.md`) |
| Codify "every time I type `/foo`, do bar" | Prompt file (`.prompt.md`) |
| Run a shell command on every edit | Hook — `PostToolUse` |
| Block dangerous tool use | Hook — `PreToolUse` w/ `permissionDecision: "deny"` |
| Inject context at session start | Hook — `SessionStart` w/ `additionalContext` |
| Save the conversation before it's compacted | Hook — `PreCompact` |
| Customize what `/review` looks for | Settings: `reviewSelection.instructions` |
| Manage a too-long chat session | `/compact` (and a `PreCompact` hook to archive) |
| Give Copilot access to a live DB / browser / API | MCP server |
| Run Copilot from a terminal / CI / script | Copilot CLI (Bonus 1) |

## Where to learn more

- **Customization overview:** https://code.visualstudio.com/docs/copilot/customization/overview
- **Skills (and the open standard):** https://agentskills.io
- **Hooks (preview):** https://code.visualstudio.com/docs/copilot/customization/hooks
- **Awesome Copilot** — community-contributed skills, agents, instructions, prompts: https://github.com/github/awesome-copilot

## Recap

The four core customizations (instructions, agents, skills, hooks) cover most of what teams need. The advanced layer above is for repos that have grown to need finer control: file-scoped rules, cross-tool standards, ad-hoc audits, external data, terminal-driven automation. Pick what solves a real pain in your repo. Don't add customizations for their own sake — every one is one more file someone has to understand.
