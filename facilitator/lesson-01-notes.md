# Facilitator notes — Lesson 1 (`copilot-instructions.md`)

Use these alongside [`../lessons/lesson-01-copilot-instructions.md`](../lessons/lesson-01-copilot-instructions.md). Each note is anchored to a specific section of the lesson — deliver it at that point.

---

## After reading "Why this customization exists"

Read the "Why" aloud. Then say:

> *"Watch what happens to the same prompt when we add 1,500 characters of project rules."*

Project the file explorer side-by-side with chat for the comparison.

---

## After Step 1.5 — "Verify the app loads" (the unguided baseline works)

Pause here. Ask the room:

> *"How many of you would be okay merging this into a real codebase as-is?"*

The answer should be: **not many.** That's exactly what `copilot-instructions.md` fixes.

---

## After Step 1.8 — saving `.github/copilot-instructions.md`

Walk the room through the structure for ~60 seconds:

> *"Each section is a focused topic. Notice the rules are concrete and short — no vague things like 'write good code'. Notice we explain the **why** in places (no frameworks → why), because the model uses that to make better decisions in edge cases. The most useful instructions are the ones that catch what linters can't."*
