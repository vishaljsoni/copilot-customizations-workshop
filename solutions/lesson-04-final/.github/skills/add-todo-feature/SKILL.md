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
- [`state.js`](../../../state.js) — current state functions
- [`app.js`](../../../app.js) — DOM wiring pattern to follow
- [`state.test.js`](../../../state.test.js) — test style to match
