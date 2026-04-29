# Lesson 1 — `copilot-instructions.md` (~15 min)

## Goal

Generate a basic to-do app **twice** — first without any customization, then with a single `copilot-instructions.md` file — and see how the same prompt produces dramatically different output.

## Why this customization exists

You've probably found yourself adding the same instructions to every prompt: *"use semantic HTML"*, *"don't use frameworks"*, *"BEM naming please"*. **Custom instructions** let you write those rules **once** in `.github/copilot-instructions.md` and Copilot applies them automatically to every chat request in the workspace.

**How it differs from a per-prompt instruction:** Per-prompt instructions are forgotten the moment that conversation ends. `copilot-instructions.md` is loaded into every chat by VS Code automatically — even in a brand new session. It's the foundation every other customization sits on top of.

---

## Phase 1A — Baseline without instructions (~5 min)

### Step 1.1 — Confirm the workspace is empty (except for the workshop docs)

In the VS Code Explorer (⇧⌘E), you should see only:
- `README.md`, `setup.md`
- `lessons/` and `solutions/` folders

There should be **no** `index.html`, `app.js`, or `.github/` folder yet.

### Step 1.2 — Open a new chat

1. Open the **Chat** view: ⌃⌘I (macOS) / Ctrl+Alt+I (Win/Linux).
2. Click the **New Chat** icon (top of the Chat view) to ensure a clean session.
3. From the agent dropdown at the bottom, pick **Agent**.
4. From the model picker, pick a recent model (Claude Sonnet 4.5 or GPT-5.x recommended).

### Step 1.3 — Send the baseline prompt

Paste this exact prompt into chat and submit it:

```
Build a simple to-do web app at the root of this workspace. It should let me add a task, mark it complete, and delete it. Plain HTML, CSS, and JavaScript only. Create whatever files you think are appropriate.
```

Approve any tool calls Copilot requests (file creation, file edits). Wait for it to finish.

### Step 1.4 — Observe what you got

Open the files Copilot created. Look for any of these (you will probably see at least 2):

- [ ] Inline `style="..."` attributes in `index.html`
- [ ] CSS classes named with no convention (e.g., `.container`, `.btn-red`, mix of camelCase + kebab-case)
- [ ] All JS in one file, no separation between state and DOM
- [ ] Click handlers attached directly to button elements (no `<form>` element used)
- [ ] No `aria-label` or semantic landmarks (`<main>`, `<header>`, `<nav>`)
- [ ] An `onclick="..."` attribute in HTML
- [ ] A "framework" snuck in (Bootstrap CDN, jQuery, etc.)

### Step 1.5 — Verify the app loads

Open `index.html` in a browser (right-click → "Reveal in Finder"/"Reveal in Explorer", then double-click). Add, complete, and delete a task. **It probably works.** That's not the point — the point is *style and structure are uncontrolled*.

### Step 1.6 — Discard the baseline files

We're going to regenerate from the same prompt with rules in place. From the integrated terminal at the repo root:

```bash
# Delete every file/folder we created in Phase 1A. Lesson docs and solutions are untouched.
find . -maxdepth 1 -type f ! -name 'README.md' ! -name 'setup.md' ! -name '.gitignore' -delete
rm -rf .github
```

Confirm with `ls -la` — you should see only `README.md`, `setup.md`, `lessons/`, `solutions/`, and `.git/`.

---

## Phase 1B — Add `copilot-instructions.md` and regenerate (~10 min)

### Step 1.7 — Create the `.github/` folder

In VS Code's terminal:

```bash
mkdir -p .github
```

### Step 1.8 — Create `.github/copilot-instructions.md`

Either:
- **A.** Type `/init` in the chat input and press Enter. Copilot will analyze the (mostly empty) workspace and generate a starter file. Then **replace** its contents with the version below — `/init` doesn't know what we're building yet. *(This option teaches the discovery flow.)*
- **B.** Create the file directly. Right-click `.github/` in the Explorer → **New File** → name it `copilot-instructions.md`.

Then paste this content:

```markdown
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
```

**Save the file.**

### Step 1.9 — Confirm Copilot loaded the instructions

1. In the Chat view, **start a new chat session** (New Chat icon — important: existing sessions don't auto-pick up new instruction files).
2. Right-click anywhere in the Chat view → **Diagnostics** (this opens the Chat customization diagnostics view).
3. You should see `copilot-instructions.md` listed under **Workspace** with no errors.

If you don't see it: confirm the file is at `.github/copilot-instructions.md` (not the workspace root). Path matters.

### Step 1.10 — Regenerate the app with the **exact same prompt**

In the new chat, paste:

```
Build a simple to-do web app at the root of this workspace. It should let me add a task, mark it complete, and delete it. Plain HTML, CSS, and JavaScript only. Create whatever files you think are appropriate.
```

Approve tool calls. Wait for completion.

### Step 1.11 — Compare to the snapshot

Open the files Copilot created and compare to [`solutions/lesson-01-final/`](../solutions/lesson-01-final/). You should now see:

- ✅ `state.js` exists with `addTodo`, `toggleTodo`, `deleteTodo` exported as pure functions
- ✅ `app.js` imports from `./state.js` and only handles DOM
- ✅ `index.html` uses `<main>`, `<header>`, `<form>`, `<ul>` (real semantic elements)
- ✅ CSS classes follow BEM (`.todo-app`, `.todo-form__input`, `.todo-item--completed`)
- ✅ Zero inline `style="..."` attributes
- ✅ Zero framework or CDN script tags
- ✅ Form submission uses `<form>` + `submit` handler, not button clicks

**The exact code will differ from the snapshot.** What matters is the *shape*: same files, same structure, same conventions.

### Step 1.12 — Smoke-test the app

Open `index.html` in a browser. You should be able to:
- Type a task and press Enter (or click Add) to add it
- Click the checkbox to toggle complete (visual line-through)
- Click the × to delete

There is no persistence yet (refreshing the page clears tasks). That's lesson 2's job.

---

## Self-check

- [ ] `.github/copilot-instructions.md` exists at the repo root
- [ ] `index.html`, `styles.css`, `state.js`, `app.js` exist at the repo root
- [ ] No inline `style="..."` attributes anywhere
- [ ] CSS uses BEM (block__element, block--modifier)
- [ ] `state.js` has no DOM references (no `document`, no `window`)
- [ ] App works in browser: add, complete, delete

If everything is checked, you're done with lesson 1. Onward to [Lesson 2 →](lesson-02-custom-agents-with-handoff.md).

## Common pitfalls

| Symptom | Fix |
| --- | --- |
| Copilot still produces inline styles | You forgot to start a **new chat** after creating the instructions file |
| `state.js` imports `document` | Re-prompt: "Refactor `state.js` to remove all DOM references; move that code to `app.js`." |
| `index.html` script tag missing `type="module"` | Add `type="module"` to the `<script>` tag manually; this enables `import` in browsers |
| Diagnostics view shows the instructions file with an error | Open the file; check there are no stray YAML markers (`---`); plain markdown only |
| Chat says "I cannot edit files" | The agent dropdown is set to **Ask**, not **Agent**. Switch it. |

## Stretch (if time)

Try sending this prompt **without** changing the instructions file:

```
Make the title bigger and add a fade-in animation to new todos.
```

Watch how Copilot makes those changes — does it use BEM modifier classes? Does it add inline styles? The instructions are still in effect; they should constrain even small follow-up edits.

## Recap

You shaped Copilot's behavior across **every** prompt in this workspace by writing one markdown file. The next lesson takes that idea further — instead of one set of always-on rules, you'll define multiple specialized **agents**, each with its own instructions, tools, and handoff to the next agent.
