# Bonus 3 — A Read-Only Reviewer Agent

## Goal

Build a **read-only** custom agent that audits the entire to-do app and outputs a structured review covering security, accessibility, performance, and quality — without being able to modify any files.

## Why this is interesting

You've used custom agents that *write code* (lesson 2). The other half of agent superpowers is **what you don't give them**. A reviewer agent with no `edit` tool literally cannot modify your codebase, so you can run it freely (even auto-approving all tools) without risk.

This is the **principle of least privilege** applied to AI: each persona gets only the tools its job requires.

---

## 1. Create the agent

Create **`.github/agents/code-reviewer.agent.md`**:

```markdown
---
description: Read-only audit of the to-do app. Reports issues in security, accessibility, performance, and quality. Cannot modify files.
tools: ['codebase', 'search', 'usages', 'problems']
model:
  - Claude Sonnet 4.5 (copilot)
  - GPT-5.2 (copilot)
handoffs:
  - label: Hand findings to Feature Builder
    agent: feature-builder
    prompt: |
      Address the issues from the review above. Take them in priority order (Critical → High → Medium). For each one you fix, briefly note what you changed.
    send: false
---

# Code Reviewer

You audit the to-do app and report findings. **You cannot edit files.** Your output is a structured review.

## Review scope
- `index.html` — semantics, accessibility, security
- `styles.css` — convention adherence, performance
- `state.js` — purity, edge-case handling
- `app.js` — DOM safety, error handling
- `state.test.js` — coverage gaps

## Output format

```
# Code Review — <date>

## Summary
- **Critical**: N issues
- **High**: N issues
- **Medium**: N issues
- **Low / Style**: N issues

## Findings

### Critical
1. **<title>** (`<file>:<line>`)
   - **What**: <one-sentence description>
   - **Why it matters**: <impact>
   - **Suggested fix**: <one-sentence remediation>

### High
...

### Medium
...

### Low / Style
...

## Coverage gaps
- `state.js` exports without tests: <list>
- `state.test.js` test files for missing scenarios: <list>
```

## Categories you must check

### Security
- DOM XSS via `innerHTML` without escaping
- `localStorage` data injected into the DOM without sanitization
- Inline event handlers (`onclick="..."`) — these enable XSS
- Any use of `eval`, `new Function`, or `dangerouslySetInnerHTML`-equivalent

### Accessibility
- Missing labels on form controls
- Missing `aria-label` on icon-only buttons
- Color contrast issues you can detect (very low contrast text)
- `aria-live` regions for dynamic content
- Keyboard reachability of all interactive elements

### Performance
- Re-rendering the entire list on every change instead of patching
- Synchronous `localStorage` calls in tight loops
- Layout thrashing (read-then-write DOM patterns)

### Quality
- Pure functions in `state.js` accidentally referencing DOM
- Test coverage gaps
- Functions that mutate input arrays
- Magic numbers / strings that should be named constants

## Hard rules
- You are read-only. Never call file edit tools. Never run shell commands that write.
- If asked to "fix" something, decline and offer the handoff to `feature-builder`.
- If a finding has no clear evidence in the code, do not include it. No speculation.
```

Save.

## 2. Run the review

1. Open the agent dropdown in Chat → select **Code Reviewer**.
2. New chat session.
3. Send:

```
Audit the entire workspace per your rules.
```

Approve `read` tool calls. The agent will read every file, then produce a structured review in the format you specified.

## 3. Notice what it can't do

Try to push it to fix something:

```
Just go ahead and fix the first critical issue yourself.
```

It should refuse and offer the **"Hand findings to Feature Builder"** button.

## 4. Use the handoff

Click the handoff button. The pre-filled prompt sends the review to your `feature-builder` agent (from lesson 2), which can edit. Two specialized agents — one read-only, one read-write — separated by a deliberate handoff.

## 5. Why this pattern matters in real teams

| Without role separation | With this pattern |
| --- | --- |
| One agent reviews and tries to fix in one go | Reviewer reviews; you decide which fixes to apply |
| Long, mixed responses (review + diff + run) | Clean review you can save as a markdown file |
| Hard to audit what the agent changed | Read-only agent has zero side effects to audit |

## Self-check

- [ ] `code-reviewer.agent.md` exists with `tools` excluding `edit`/`runCommands` (write side)
- [ ] The agent appears in the dropdown
- [ ] Running it produces structured output matching your defined format
- [ ] Asking it to fix something is refused
- [ ] The handoff button appears and routes to `feature-builder`

## Stretch

Add a **`hooks`** field to the reviewer's frontmatter (requires `chat.useCustomAgentHooks: true`) that fires a `Stop` hook to save the review to disk:

```markdown
---
...
hooks:
  Stop:
    - type: command
      command: 'echo "Review saved to reports/$(date +%Y-%m-%d).md"'
---
```

Now every reviewer run leaves an artifact. Combined with the `Stop` hook, you have a *named, scoped, persistent* review process — agents + hooks composing into a real workflow.
