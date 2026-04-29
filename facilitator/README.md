# Facilitator Track

Everything in this folder is for the **person running the workshop**, not for attendees. When distributing the repo to customers/attendees, **delete or omit this entire `facilitator/` folder** and the lesson files will be clean of presenter-only material.

## What's here

| File | Purpose |
| --- | --- |
| [`FACILITATOR.md`](FACILITATOR.md) | Pre-flight checklist, pacing, recovery playbook, and talking points |
| [`lesson-01-notes.md`](lesson-01-notes.md) | Narration callouts to read aloud during lesson 1 |
| [`lesson-02-notes.md`](lesson-02-notes.md) | Narration callouts for lesson 2 |
| [`lesson-03-notes.md`](lesson-03-notes.md) | Narration callouts for lesson 3 |
| [`lesson-04-notes.md`](lesson-04-notes.md) | Narration callouts for lesson 4 |

## How to use

1. Read [`FACILITATOR.md`](FACILITATOR.md) once before the breakout.
2. During each lesson, keep the matching `lesson-XX-notes.md` open in a side pane next to the lesson markdown the attendees are working through. Each note is anchored to a specific step in the lesson so you know exactly when to deliver it.

## Distributing the repo to customers

To produce a clean attendee bundle, just remove this folder:

```bash
rm -rf facilitator/
```

The remaining files (`README.md`, `setup.md`, `lessons/`, `solutions/`) are the attendee-facing track and contain no presenter-only content.
