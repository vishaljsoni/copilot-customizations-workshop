# To-Do App — Project Conventions

This is a workshop to-do app built with **vanilla HTML, CSS, and JavaScript** — no frameworks, no build tools.

## Stack rules
- Plain HTML5, CSS3, and modern JavaScript (ES2022+, ES modules).
- No frameworks (React, Vue, Angular, etc.). No bundlers (Vite, webpack). No CSS preprocessors.
- No npm runtime dependencies. The only `package.json` script is `node --test`.

## File layout
- `index.html` — single page; loads `app.js` as `<script type="module">`.
- `styles.css` — all styles. No inline `style="..."` attributes.
- `state.js` — pure state functions, exported as ES modules. No DOM access.
- `app.js` — DOM wiring only. Imports from `./state.js`.
- `state.test.js` — `node --test` tests for `state.js`.

## HTML
- Use semantic elements: `<header>`, `<main>`, `<nav>`, `<form>`, `<ul>`, `<button>`.
- Every interactive control has an accessible label (`<label for>`, `aria-label`, or visible text).
- Forms use real `<form>` elements with `submit` handlers, never click handlers on buttons.

## CSS
- Use BEM naming: `.block`, `.block__element`, `.block--modifier`.
- Define spacing/colors as CSS custom properties at `:root`.
- No `!important`, no inline styles.

## JavaScript
- ES modules (`import` / `export`). No CommonJS.
- State operations are **pure**: take state in, return new state out. No mutation.
- DOM code lives in `app.js`. Never import from `app.js` in `state.js`.
- Use `const` by default, `let` only when reassignment is required.
- Use template literals over string concatenation.

## Testing
- Tests use the built-in `node:test` runner — no Jest, no Mocha.
- Every pure function in `state.js` has at least one test in `state.test.js`.
- Tests pass `now` explicitly to deterministic helpers (e.g. `createTodo("x", 1000)`).
