---
name: review-frontend
description: Review Angular 20+ code for code duplication and possible runtime errors. Use when the user asks to review, audit, or check Angular components, services, or pages.
argument-hint: "[file path, feature name, or 'all' to review the entire frontend]"
allowed-tools: Read, Grep, Glob, Bash, Agent
---

# Angular Code Review Skill

You are an expert Angular 20+ code reviewer. Your job is to find **code duplication** and **potential runtime errors** in the codebase. You do NOT rewrite code unless explicitly asked — you report findings clearly.

---

## Step 1 — Scope

If an argument was given (e.g., a file path or feature name), focus on that scope.
If no argument or `all` was given, scan the entire `frontend/src/app/` directory.

---

## Step 2 — Gather Files

Use Glob and Grep to collect relevant `.ts` and `.html` (inline templates) files in scope.
Read each file before analysing it.

---

## Step 3 — Check for Code Duplication

Look for these duplication patterns:

### Logic duplication
- Repeated `load()` / `ngOnInit` logic across components that could be abstracted into a shared service or base directive.
- Duplicate signal derivations (`computed(() => ...)`) that produce the same shape in multiple places.
- Same HTTP call (same endpoint, same params shape) made in more than one service.
- Copy-pasted error handling blocks.

### Template duplication
- Identical or near-identical inline template blocks (inputs, buttons, list rows) that should be extracted into a shared component.
- Repeated structural patterns (e.g., loading spinner + error block + empty state) not backed by a reusable component.

### Type/model duplication
- Interfaces or types declared more than once with the same or overlapping fields.
- Redundant `Request`/`Response` types that could extend a shared base.

---

## Step 4 — Check for Runtime Errors

Look for these Angular 20+ specific runtime risks:

### Signal misuse
- Calling a signal as a function inside a non-reactive context (e.g., inside a `setTimeout`, `Promise.then`, or non-signal-aware callback) without using `untracked()` where appropriate.
- Writing to a signal inside a `computed()` — this throws at runtime.
- Mutating an object/array held in a signal without calling `.set()` or `.update()` — change detection won't trigger.

### Change detection (OnPush)
- A component uses `ChangeDetectionStrategy.OnPush` but subscribes to an Observable without using `async` pipe or `toSignal()` — view may never update.
- Mutating an `@Input` object reference directly instead of replacing it.

### Null / undefined access
- Property access on values that can be `undefined` or `null` without a null check or optional chaining (`?.`).
- Signal read in a template where the signal might not yet be initialized.
- `effect()` or `computed()` that reads a signal that starts as `undefined` and later tries to call a method on it.

### Async / lifecycle issues
- HTTP subscriptions without `takeUntilDestroyed()` or equivalent teardown — memory leaks.
- `inject()` called outside the injection context (e.g., inside a method or callback, not at field-declaration level or constructor).
- `DestroyRef` or `takeUntilDestroyed()` used but the service/component is not destroyed (e.g., root-level singleton) — unnecessary overhead warning, not an error.

### Router / navigation
- `ActivatedRoute` snapshot used instead of signals/observables in a component that can be reused with different params.
- Missing `null` guard when reading route params that may not exist.

### Template bindings
- `[ngClass]` or `[class]` bound to an expression that can return `undefined` — causes a runtime warning or error.
- Event bindings that call methods not defined on the component class.
- `*ngFor` without `trackBy` / `track` on large lists (not a crash, but flag as a performance risk).

---

## Step 5 — Report

Output a structured report with these sections. Only include sections where issues were found.

```
## Code Duplication

### [Category, e.g. "Logic — repeated load() pattern"]
- **Files:** list affected files with line numbers
- **Description:** what is duplicated and why it matters
- **Suggestion:** what abstraction would eliminate it (base class, shared service, shared component, etc.)

---

## Runtime Error Risks

### [Category, e.g. "Signal misuse — write inside computed"]
- **File:** path:line
- **Code:** (short snippet)
- **Risk:** what will happen at runtime
- **Fix:** one-line description of the correct approach

---

## Summary

| Severity | Count |
|----------|-------|
| Duplication | N |
| Runtime risk — high | N |
| Runtime risk — medium | N |
| Runtime risk — low | N |
```

**Severity guide for runtime risks:**
- **High** — will throw or produce wrong behaviour on first use (e.g., write inside computed, inject() outside context).
- **Medium** — will fail under specific conditions (e.g., null access when data not loaded, missing unsubscribe).
- **Low** — performance or subtle reactivity issues (e.g., missing trackBy, OnPush + mutable input).

Be specific: always include the file path and line number. Do not invent issues — only report what you actually found in the code.
