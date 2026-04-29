# Lesson 3 — Skills (~13 min)

## Goal

Create a **skill** that teaches Copilot the project's repeatable "add a feature" recipe, then invoke it to add an All / Active / Completed filter.

## Why this customization exists

You now have always-on instructions (lesson 1) and named personas (lesson 2). What's still missing: a way to package a **specific procedure** that Copilot loads only when it's relevant.

A **skill** is a folder under `.github/skills/<name>/` containing:
- `SKILL.md` with `name` + `description` frontmatter
- Optional supporting files (templates, scripts, examples)

Copilot reads only the `name` and `description` of every skill at session start (cheap). When the user's prompt matches the description, Copilot loads the full `SKILL.md` body. When the body references other files, those load only if needed. This **three-level progressive loading** means you can install dozens of skills without bloating context.

**How it differs from the previous two:**

| | Instructions (lesson 1) | Custom agent (lesson 2) | Skill (this lesson) |
| --- | --- | --- | --- |
| **Loaded** | Always (every chat) | When user picks the agent | On-demand, when relevant |
| **Granularity** | Whole-project rules | Persona + tool restrictions + handoffs | Single capability / recipe |
| **Invocation** | Automatic | User picks from dropdown | `/<name>` slash command **or** auto-loaded by Copilot |
| **Best for** | "Always do BEM" | "Be a Code Reviewer" | "When asked to add a feature, follow this 5-step recipe" |

### Starting state

You finished lesson 2 with persistence and tests. Verify:

```bash
ls -la .github/agents
ls .github/copilot-instructions.md
node --test 2>&1 | tail -3
```

If anything's missing, recover:

```bash
cp -R solutions/lesson-02-final/. .
```

---

## Phase 3A — Create the skill (~5 min)

### Step 3.1 — Create the skill folder

The skill's **directory name must match** the `name` field in its frontmatter. We'll use `add-todo-feature`.

```bash
mkdir -p .github/skills/add-todo-feature
```

### Step 3.2 — Create `SKILL.md`

Right-click `.github/skills/add-todo-feature/` in the Explorer → **New File** → name it **`SKILL.md`** (capitalization matters).

Paste this content:

```markdown
---
name: add-todo-feature
description: Use this skill when the user asks to add a new feature to the to-do app (filter, sort, due date, tag, search, undo, etc.). Walks through the project's standard pattern of extending pure state in state.js, wiring the DOM in app.js, and adding tests in state.test.js.
---

# Add a To-Do Feature

This skill captures the project's repeatable recipe for adding a feature to the to-do app.

## When to use this skill
Trigger this skill when the user asks for a new feature on the to-do app, e.g.:
- "Add a filter for completed tasks"
- "Let users edit a task in place"
- "Add a due-date field"
- "Sort tasks alphabetically"

## The recipe

Follow these steps in order. Do not skip steps.

### 1. Identify the pure state change
Decide what new operation the feature needs in `state.js`. Examples:
- New filter → `filterTodos(todos, filter)`
- Edit text → `editTodo(todos, id, text)`
- Sort → `sortTodos(todos, key)`

The function MUST be:
- Pure (no DOM, no `localStorage`, no `Date.now()` reads — accept a `now` parameter if needed).
- Side-effect free (returns new array; does not mutate input).
- Exported from `state.js`.

### 2. Add the function to `state.js`
- Add a JSDoc signature.
- Place it near similar functions (read functions together, write functions together).

### 3. Wire the DOM in `app.js`
- Add markup to `index.html` if needed (semantic elements, BEM classes).
- Add styles to `styles.css` if needed (BEM, no `!important`, no inline styles).
- In `app.js`, import the new function from `./state.js` and add an event listener.
- Update the `render()` function so the new feature is reflected on screen.

### 4. Add tests in `state.test.js`
- One `test(...)` block per behavior, not per function.
- Cover at least: happy path, empty input, edge case.
- Use deterministic ids: pass an explicit `now` to `createTodo`.

### 5. Verify
- Run `node --test` in the terminal.
- Open `index.html` in a browser and click through the new feature.
- Check the browser console for errors.

## Anti-patterns to avoid
- Putting state logic in `app.js` event handlers ("just inline it for now").
- Mutating the existing `state.todos` array in place.
- Adding a test framework package — `node --test` is sufficient.
- Adding inline `style="..."` attributes for "just one tweak".

## Reference
- `state.js` — current state functions
- `app.js` — DOM wiring pattern to follow
- `state.test.js` — test style to match
```

Save the file.

### Step 3.3 — Confirm the skill is detected

1. Open the Chat view.
2. Type `/` in the chat input.
3. You should see **`/add-todo-feature`** in the slash-command list, alongside built-in commands like `/init`.

If it doesn't appear:
- Verify the file is at `.github/skills/add-todo-feature/SKILL.md` (capital S, capital ILL.md).
- Verify the `name:` field in frontmatter matches the folder name exactly.
- Right-click in Chat view → **Diagnostics** for parse errors.

---

## Phase 3B — Use the skill to add a filter (~7 min)

### Step 3.4 — Switch back to the default Agent (not your custom agents)

The skill is most powerful when you let Copilot decide whether to load it. Switch the agent dropdown to the built-in **Agent**.

(You *can* combine skills with custom agents — the skill body becomes part of the agent's context — but for this lesson we want to see the auto-discovery behavior.)

### Step 3.5 — Send a feature request **without** mentioning the skill name

In a new chat, send:

```
Add a filter so I can show All, Active, or Completed tasks. The current filter should be visually highlighted.
```

Watch the chat carefully. Within the references section of Copilot's response (the small "References" block above or below its answer), you should see **`add-todo-feature`** listed — Copilot auto-loaded the skill because the description matched the request.

### Step 3.6 — Watch the recipe play out

Copilot should follow the 5 steps from the skill:

1. **`state.js`** gets a new pure function — likely `filterTodos(todos, filter)`.
2. **`app.js`** imports it, adds filter state, and updates `render()`.
3. **`index.html`** gets a `<nav class="todo-filters">` block with three buttons.
4. **`styles.css`** gets BEM-named filter button styles, including an `--active` modifier.
5. **`state.test.js`** gets new test blocks for `filterTodos`.
6. Copilot runs `node --test` and reports the result.

Approve tool calls as they appear.

### Step 3.7 — Verify

```bash
node --test 2>&1 | tail -5
```

You should see at least 8 tests passing (6 from lesson 2 + at least 2 new for `filterTodos`).

Open `index.html` in your browser:
- Add three tasks; complete one of them.
- Click **Active** → only the incomplete two show.
- Click **Completed** → only the one completed shows.
- Click **All** → all three reappear.
- Refresh → state persists (lesson 2 is still working).

### Step 3.8 — Try explicit invocation

Even though the skill auto-loaded above, you can also call it explicitly. In a new chat:

```
/add-todo-feature add a "Clear completed" button that removes all completed todos at once
```

The skill body is loaded immediately (no auto-discovery delay), and Copilot follows the same recipe for the Clear Completed button. Approve the changes; tests should still pass.

---

## Self-check

- [ ] `.github/skills/add-todo-feature/SKILL.md` exists
- [ ] Typing `/` in chat shows `/add-todo-feature`
- [ ] Filter buttons appear in the app (All / Active / Completed)
- [ ] Filter buttons actually filter — both visually and after refresh
- [ ] `state.js` has a pure `filterTodos` function
- [ ] `state.test.js` has new tests for `filterTodos`
- [ ] `node --test` passes (8+ tests)

If everything is checked, onward to [Lesson 4 →](lesson-04-hooks.md).

## Common pitfalls

| Symptom | Fix |
| --- | --- |
| `/add-todo-feature` doesn't show up | `name` in frontmatter doesn't match folder name; both must be lowercase + hyphens |
| Skill's body never loads (no recipe followed) | `description` field is too vague; rewrite to mention "feature", "filter", "todo" specifically |
| Filter logic ended up in `app.js` instead of `state.js` | Skill says "must be pure"; re-prompt: "Move the filter logic to a pure exported function in `state.js`." |
| Filter buttons don't visually highlight | Skill said use BEM `--active` modifier; check `styles.css` for `.todo-filters__button--active` |
| Tests broke after the change | Run `node --test` and read the failure; usually a small assertion mismatch |
| You see lots of slash commands and can't find yours | Filter the picker by typing `add-todo` after the `/` |

## Stretch (if time)

Skills can ship **resources** alongside `SKILL.md`. Try this:

1. Add a file `.github/skills/add-todo-feature/test-template.md` containing a minimal test boilerplate.
2. In `SKILL.md`, reference it: `[test template](./test-template.md)`.
3. Re-prompt: `/add-todo-feature add a "search by text" feature`. Copilot will load the template only if it references it.

This is the **third** loading level: name+description first, then `SKILL.md` body, then referenced files. Each level only loads when needed — that's why you can install many skills.

## Recap

You added a third customization layer. Where instructions are *rules* and agents are *personas*, skills are *recipes* — loaded only when they match the task. The next lesson is the most different of the four: instead of shaping what the model says, **hooks** shape what your computer does in response to model actions. Tests on every edit, deterministically.
