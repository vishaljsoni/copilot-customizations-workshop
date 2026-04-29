# Facilitator Guide

Read this **once before the breakout** and keep it open during the session.

> **Bottom line:** You are not lecturing. You are running a 60-min hands-on lab where attendees learn by doing. Your job is (1) explain the *why* of each customization in 1–2 sentences, (2) keep the room together on pacing, (3) unblock people fast.

---

## Pre-flight (do at least 1 day before)

- [ ] Run [`setup.md`](../setup.md) end-to-end on a clean machine. Smoke test must pass.
- [ ] Run all four lessons verbatim against your own VS Code in a scratch folder. Time each lesson.
- [ ] Verify recovery: `cp -R solutions/lesson-02-final/. <scratch>` and confirm lesson 3 still works from that state.
- [ ] Read the "Why this matters" section of each lesson — you'll paraphrase these on the call.
- [ ] If you'll demo on screen, increase font sizes (Editor: 16+, Chat: 14+).
- [ ] Have a fallback model in mind. If GPT-5 has a quota error mid-room, switch to Claude Sonnet 4.5 or whatever's available.

## During the breakout

### Opening (3 min)
- One sentence: "We'll build a to-do app and along the way layer four Copilot customizations: instructions, agents, skills, hooks. Recovery snapshots in `solutions/` if you fall behind."
- Tell attendees to keep two things open: the lesson markdown and VS Code Chat side-by-side.
- Confirm everyone passed the smoke test in `setup.md`. If anyone hasn't, ask them to keep working on it; they can rejoin in lesson 2 from the lesson-01 snapshot.

### Per-lesson rhythm

For each lesson:

1. **Read the "Goal" and "Why this matters" aloud** (30 sec). These two sections are the only thing you *narrate*. The rest is the attendees' to follow.
2. **Set a soft deadline:** "I'll check in at the X-min mark."
3. **Float silently for ~2 min**, then check the room. If >50% are stuck on the same step, demo it on screen.
4. **At the soft deadline**, whoever is still behind: tell them to copy the snapshot and continue.

### Pacing checkpoints

| At minute | Expected state |
| --- | --- |
| 5 | Smoke test passed, in lesson 1 |
| 20 | `index.html` + customization-aware regen done, in lesson 2 |
| 40 | Tests passing, agents in `.github/agents/`, in lesson 3 |
| 53 | Filter feature works, skill exists, in lesson 4 |
| 60 | Hook fires after edits, optional bonus track |

If a checkpoint slips by >2 minutes for >50% of the room, **skip the stretch goals** in subsequent lessons.

## Common attendee failure modes (and fixes)

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| "Copilot didn't follow my instructions" | Forgot to save `copilot-instructions.md` before re-prompting | Save the file, start a **new** chat, re-run prompt |
| Agent dropdown doesn't show their custom agent | File outside `.github/agents/`, or filename missing `.agent.md` | Move file or rename |
| Skill doesn't appear under `/` | `name` in frontmatter doesn't match parent directory name | Rename to match exactly (lowercase + hyphens) |
| Hook doesn't fire | Wrong event type, JSON malformed, or hook in wrong path | Check **Output → GitHub Copilot Chat Hooks** channel |
| Tests fail after agent's edits | `state.js` accidentally imports DOM | Hand off back to feature-builder; instruct it to revert and keep `state.js` pure |
| `node --test` says nothing found | Test file not named `*.test.js` | Rename |
| `copilot-instructions.md` ignored | File at workspace root, not `.github/` | Move into `.github/` |
| Chat output channel empty when troubleshooting | Wrong channel selected | View → Output → dropdown → "GitHub Copilot Chat" or "GitHub Copilot Chat Hooks" |

## Recovery playbook

When someone is more than one step behind, don't try to debug — recover.

```bash
# In the attendee's terminal, from the repo root:
cp -R solutions/lesson-02-final/. .
```

Replace `02` with whatever lesson they should be **starting from**. The trailing `.` in `lesson-XX-final/.` ensures hidden files (the `.github/` folder) are copied. **Verify** by:

```bash
ls -la
ls -la .github
```

Then have them open a **new** chat session and continue with the next lesson.

## What to project / share

- Always share the **VS Code window**, not just the Chat view — attendees need to see file paths and the explorer for orientation.
- For lesson 4, also keep the **Output** panel visible (channel: "GitHub Copilot Chat Hooks"). The hook firing on screen is the moment that sells the lesson.
- For lesson 2, when an agent shows the handoff button, **slow down**. Talk through what just happened: "Notice the agent finished, then offered a button. That's the handoff. It pre-fills a prompt for the next agent." This is the highest-value 30 seconds of the workshop.

## Talking points (one sentence each)

Memorize these — they are the *why* you bring to the room:

- **Lesson 1 / instructions:** *"You write the rules once; every chat applies them. No more 'remember to use BEM' in every prompt."*
- **Lesson 2 / agents:** *"Single agents do everything. Specialized agents do their thing well. Handoff turns serial work into a guided flow with review points."*
- **Lesson 3 / skills:** *"Instructions tell Copilot 'always do X.' Skills tell it 'when the user asks for Y, here's the recipe.' Skills load on demand, so they don't bloat your context."*
- **Lesson 4 / hooks:** *"Instructions and skills shape what the model says. Hooks shape what your computer does — deterministically — when the model acts. Tests on every edit means feedback in seconds, not minutes."*

## Per-lesson narration notes

Each lesson has its own "facilitator track" callouts pulled out into a sibling file. Keep the matching one open while running that lesson:

- [`lesson-01-notes.md`](lesson-01-notes.md)
- [`lesson-02-notes.md`](lesson-02-notes.md)
- [`lesson-03-notes.md`](lesson-03-notes.md)
- [`lesson-04-notes.md`](lesson-04-notes.md)

## Bonus track

If time permits, point advanced attendees at [`lessons/bonus-01-copilot-cli.md`](../lessons/bonus-01-copilot-cli.md). The bonus track is *not* meant to be completed — pick what interests them.

## After the breakout

- Encourage attendees to take their `.github/` folder and drop it into their own repos as a starting point.
- Point them at the [Awesome Copilot repo](https://github.com/github/awesome-copilot) for community-contributed customizations.
- Solicit feedback on which customization clicked the most — that's where to go deeper next time.
