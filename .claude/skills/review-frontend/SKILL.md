---
name: review-frontend
description: Review Angular 20+ code for code duplication and possible runtime errors. Use when the user asks to review, audit, or check Angular components, services, or pages.
argument-hint: "[file path, feature name, or 'all' to review the entire frontend]"
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

## Step 3 — Run Test Suite

Run the frontend test suite:

```
cd frontend && npm test -- --watch=false
```

Capture the full output.

- If **all tests pass**: record "Test suite: N tests passed" in the report.
- If **any tests fail**: collect each failing test — its `describe` path, `it()` label, and the failure message. These are reported under "Test Failures" in the final report.

Do not abort the rest of the review if tests fail — continue to all remaining steps.

---

## Step 4 — Check Missing Test Scenarios

The frontend has minimal test coverage. Focus on surfacing gaps in **services and shared utilities with complex logic** — not every component needs a test.

### Missing spec files (high priority)
- A service in `features/*/services/` or `shared/*/services/` that has complex signal derivation, HTTP calls, or pagination logic but no corresponding `.spec.ts` file.
- A shared directive or abstract base class (e.g., `PaginatedListDirective`, `PaginationService`) with no spec file.

### Missing scenarios within an existing spec
For any spec file that does exist:
- A public method or signal computation on the class under test that has no `it()` covering it.
- An error path (e.g., service `error` signal set to a non-null value, failed HTTP call) with no test.

### Do NOT flag
- Individual feature components (`TasksComponent`, `ProjectDetailComponent`, etc.) that lack tests — Angular component testing requires `TestBed` setup and the project has no established component testing pattern yet.
- The `app.component.spec.ts` smoke test — it is intentionally minimal.

Only flag gaps that are clearly missing and realistically testable with the project's current test tooling.

---

## Step 5 — Check for Code Duplication

Duplication analysis happens at **two levels**: within a single feature, and **across features** (app-level). Cross-feature duplication is higher priority — if two or more features share the same structure, it likely belongs in `shared/`.

Before flagging any duplication, apply the **domain specificity test**:

> **Generic vs domain-specific rule:**
> - If the duplicated code is shaped entirely by its domain (e.g., a `TaskFormComponent` and a `ProjectFormComponent` with different fields, labels, and validation) — **do not flag it**. Form components, detail pages, and entity-specific templates are intentionally parallel, not accidentally duplicated.
> - If the duplicated code is infrastructure or structural (loading states, pagination wiring, error blocks, HTTP call patterns, signal derivations) and the only difference is a type or endpoint string — **flag it** and suggest a generic abstraction.

### Cross-feature logic duplication (app-level)
- Two or more feature services (e.g., `tasks.service.ts`, `contexts.service.ts`) that implement the same pagination/load/sort wiring — check if a base `PaginationService<T,P>` is already in `shared/` and whether these services correctly extend it, or if they are reimplementing it by hand.
- Two or more list components (e.g., `TasksComponent`, `ContextsComponent`) that repeat the same `prevPage()` / `nextPage()` / `setSortOption()` scaffolding — check if `PaginatedListDirective` is available and used; if not, flag as an abstraction opportunity.
- The same computed `Map<id, entity>` (e.g., `projectMap`) built independently in multiple detail components.
- Identical guard/redirect logic duplicated in multiple route guards or resolvers.

### Within-feature logic duplication
- Repeated `load()` / `ngOnInit` logic inside a single feature that could use the base service or directive.
- Duplicate signal derivations (`computed(() => ...)`) that produce the same shape in multiple places within a feature.
- Copy-pasted error handling blocks within the same feature.

### Cross-feature template duplication (app-level)
- Identical structural chrome (loading spinner + error block + empty state) copy-pasted across feature list pages — suggest a shared wrapper component in `shared/components/`.
- The same pagination controls block duplicated in multiple templates — check if `PaginationComponent` from `shared/pagination/` is already available.

### Within-feature template duplication
- Identical or near-identical inline template blocks (buttons, list rows) that should be a local sub-component — only flag if the duplication is within the same feature and is not domain-specific.

### Type/model duplication
- Interfaces or types declared more than once with the same or overlapping fields across features.
- `Request` types in multiple features that duplicate the same base fields instead of using `Omit<PaginationRequest, ...> &  { ... }` as the shared base.

---

## Step 6 — Check for Runtime Errors

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

## Step 7 — Report

Output a structured report with these sections. Only include sections where issues were found.

```
## Test Failures

### [Test name, e.g. "App > should create the app"]
- **File:** src/app/app.component.spec.ts
- **Error:** (failure message from test output)

---

## Missing Test Scenarios

### [Category, e.g. "Service — no spec file for TasksService"]
- **Source:** path to source file
- **Missing:** what scenario or spec file is absent
- **Suggestion:** one-line description of the test that should be written

---

## Code Duplication

### [Category, e.g. "Cross-feature — repeated load() pattern across TasksService and ContextsService"]
- **Scope:** cross-feature | within-feature
- **Files:** list affected files with line numbers
- **Description:** what is duplicated and why it matters
- **Suggestion:** what abstraction would eliminate it (base class, shared service, shared component, etc.), or reference the existing shared abstraction that should be used instead
- **Note:** omit this entry entirely if the code is domain-specific (e.g., form fields, entity-specific templates)

---

## Runtime Error Risks

### [Category, e.g. "Signal misuse — write inside computed"]
- **File:** path:line
- **Code:** (short snippet)
- **Risk:** what will happen at runtime
- **Fix:** one-line description of the correct approach

---

## Summary

| Category | Count |
|----------|-------|
| Test failures | N |
| Missing test scenarios | N |
| Duplication — cross-feature | N |
| Duplication — within-feature | N |
| Runtime risk — high | N |
| Runtime risk — medium | N |
| Runtime risk — low | N |
```

**Severity guide for runtime risks:**
- **High** — will throw or produce wrong behaviour on first use (e.g., write inside computed, inject() outside context).
- **Medium** — will fail under specific conditions (e.g., null access when data not loaded, missing unsubscribe).
- **Low** — performance or subtle reactivity issues (e.g., missing trackBy, OnPush + mutable input).

Be specific: always include the file path and line number. Do not invent issues — only report what you actually found in the code.
