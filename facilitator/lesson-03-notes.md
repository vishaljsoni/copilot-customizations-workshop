# Facilitator notes — Lesson 3 (Skills)

Use these alongside [`../lessons/lesson-03-skills.md`](../lessons/lesson-03-skills.md). Each note is anchored to a specific section of the lesson — deliver it at that point.

---

## After the comparison table in "Why this customization exists"

Read the comparison table aloud — this is the slide. Skills are the customization most teams have never heard of, so spend an extra 30 seconds here.

> *"Skills are the Marie Kondo of Copilot context: only loaded when they spark joy for the current task."*

---

## After Step 3.2 — saving `SKILL.md`

Two callouts:

1. *"Notice `name` in the frontmatter must match the parent folder name exactly. Names must be lowercase with hyphens. If they don't match, the skill silently fails to load — common gotcha."*
2. *"The `description` field is what Copilot reads to decide whether to load this skill. Be **specific** about both *what* and *when*. Vague descriptions like 'helps with todos' won't get triggered."*

---

## After Step 3.5 — auto-discovery via the default Agent

Pause here.

> *"Notice we never typed `/add-todo-feature`. Copilot read the skill's description, decided 'this is a feature add,' and pulled in the recipe. That's auto-invocation."*

---

## After Step 3.8 — explicit invocation via `/add-todo-feature`

> *"Instructions are 'always loaded.' Skills are 'loaded when needed.' That's the whole mental model. Use skills for procedures, instructions for rules."*
