# GitHub Copilot Customizations — 60-Minute Breakout

Build a working to-do app from an empty folder while learning **how to customize GitHub Copilot** for your team. Every step has copy-paste prompts, expected output, and a self-check.

## What you will learn

By the end of 60 minutes you will have used and *understood* four core Copilot customizations:

1. **`.github/copilot-instructions.md`** — repo-wide rules that apply to every chat request.
2. **Custom agents with handoff** (`.github/agents/*.agent.md`) — specialized personas that pass control between each other.
3. **Skills** (`.github/skills/<name>/SKILL.md`) — packaged how-tos that Copilot loads on demand.
4. **Hooks** (`.github/hooks/*.json`) — deterministic shell commands that fire on lifecycle events.

If you finish early, the bonus lessons cover **Copilot CLI**, prompt files + hooks for tests, a custom **reviewer agent**, multi-agent **handoff for framework conversion**, and a cheat-sheet of advanced customizations (`AGENTS.md`, scoped `.instructions.md`, `/compact`, `/review`, MCP servers).

## Audience and prerequisites

You should already be comfortable using Copilot Chat in agent mode. You do **not** need prior experience with any customization features.

Before the breakout, complete [`setup.md`](setup.md). It takes ~5 minutes.

## Agenda (60 minutes)

| Time | Lesson | Customization | Outcome |
| --- | --- | --- | --- |
| 0–5 | Setup check | — | Workspace open, Copilot responding, Node available |
| 5–20 | [Lesson 1](lessons/lesson-01-copilot-instructions.md) | `copilot-instructions.md` | Baseline app generated twice — once unguided, once guided |
| 20–40 | [Lesson 2](lessons/lesson-02-custom-agents-with-handoff.md) | Custom agents + handoff | Two agents add `localStorage` and tests via explicit handoff |
| 40–53 | [Lesson 3](lessons/lesson-03-skills.md) | Skill | Filter feature added by invoking a skill |
| 53–60 | [Lesson 4](lessons/lesson-04-hooks.md) | Hook | Tests run automatically after every Copilot edit |

## Bonus / advanced (untimed, for early finishers)

| Lesson | Topic |
| --- | --- |
| [Bonus 1](lessons/bonus-01-copilot-cli.md) | Install and use **GitHub Copilot CLI** |
| [Bonus 2](lessons/bonus-02-tests-via-prompt-and-hook.md) | Custom **prompt file** + **hook** for test generation |
| [Bonus 3](lessons/bonus-03-reviewer-agent.md) | Read-only **reviewer agent** that audits the app |
| [Bonus 4](lessons/bonus-04-framework-conversion-via-handoff.md) | Multi-agent **handoff** for a framework conversion |
| [Bonus 5](lessons/bonus-05-additional-customizations.md) | Cheat-sheet: scoped instructions, `AGENTS.md`, `/compact`, `/review`, MCP, and a decision matrix |

## Repository layout

```
copilot-workshop/
├── README.md                 # this file
├── setup.md                  # 5-min prereq check
├── lessons/
│   ├── lesson-01-copilot-instructions.md
│   ├── lesson-02-custom-agents-with-handoff.md
│   ├── lesson-03-skills.md
│   ├── lesson-04-hooks.md
│   ├── bonus-01-copilot-cli.md
│   ├── bonus-02-tests-via-prompt-and-hook.md
│   ├── bonus-03-reviewer-agent.md
│   ├── bonus-04-framework-conversion-via-handoff.md
│   └── bonus-05-additional-customizations.md
└── solutions/
    ├── lesson-01-final/      # end-state of each lesson
    ├── lesson-02-final/
    ├── lesson-03-final/
    └── lesson-04-final/
```

You will create files at the **root** of this repo (`index.html`, `styles.css`, `app.js`, `state.js`, `state.test.js`, `package.json`, `.github/...`) as you go. The `lessons/` and `solutions/` folders stay untouched.

## If you fall behind

Each lesson has a recovery snapshot in `solutions/`. From the repo root:

```bash
# Recover to end-of-lesson-2 state (replace 02 with whichever lesson)
cp -R solutions/lesson-02-final/. .
```

The trailing `.` is important — it copies hidden files like `.github/`.

## A note on non-determinism

Copilot output varies between runs. Each lesson tells you the **shape** to expect (file names, structure, key behaviors), not byte-for-byte text. If your output diverges materially, the "Common pitfalls" section in each lesson explains how to recover.

## Glossary

| Term | One-line definition |
| --- | --- |
| **Custom instructions** | Always-on rules in `.github/copilot-instructions.md` (or `AGENTS.md`). |
| **Instructions file** | A `.instructions.md` file with `applyTo` glob — applied conditionally. |
| **Custom agent** | A `.agent.md` persona with its own tools, model, and handoffs. |
| **Prompt file** | A `.prompt.md` invocable via `/name` in chat. One-shot template. |
| **Skill** | A `SKILL.md`-rooted directory describing a reusable capability. |
| **Hook** | A shell command run on a lifecycle event (PostToolUse, Stop, etc.). |
| **Handoff** | A button shown after one agent finishes that switches to another agent with a pre-filled prompt. |

## Reference

- VS Code Copilot customization docs: https://code.visualstudio.com/docs/copilot/customization/overview
- Hooks (preview): https://code.visualstudio.com/docs/copilot/customization/hooks
- Custom agents: https://code.visualstudio.com/docs/copilot/customization/custom-agents
- Skills: https://code.visualstudio.com/docs/copilot/customization/agent-skills
- Copilot CLI: https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli
