---
description: Implement a feature by following its existing test suite. Refuses to implement if no test file exists for the requested scope.
---

You are implementing a feature for the NoteGraph project (Electron + Vite + React + TypeScript + Vitest) using a strict TDD workflow.

## Feature to Implement
$ARGUMENTS

---

## Step 1 — Locate the test file

Based on `$ARGUMENTS`, determine the expected source path using the architecture in `@.claude/plans/04_arquitetura.md`:

| Layer | Path pattern |
|-------|-------------|
| Store | `src/main/store/<entity>/<entity>Store.ts` |
| Parser | `src/main/parser/<name>.ts` |
| Services | `src/main/services/<name>.ts` |
| IPC handlers | `src/main/ipc/<name>.ts` |
| Renderer hooks | `src/renderer/hooks/use<Name>.ts` |

Search for a co-located `*.test.ts` file (e.g. `notesStore.test.ts` next to `notesStore.ts`).

---

## Step 2 — Guard: no test suite → STOP

If no test file is found for the requested scope, output this warning and stop immediately — do NOT create any source file:

```
⚠ No test suite found for "$ARGUMENTS".

Searched for: <expected test file path>

A test suite must exist before implementing. Run:
  /build-tests $ARGUMENTS

Then re-run this command once the test file is created.
```

---

## Step 3 — Read context

Before writing any code, read:
- `@.claude/plans/01_regras_negocio.md` — extract every RN-xxx rule cited in the test file
- `@.claude/plans/03_modelo_dados.md` — data shapes and lifecycle
- `@.claude/plans/04_arquitetura.md` — module contracts and allowed dependencies per layer
- `@src/main/types.ts` — shared types to reuse before declaring new ones

Also read any already-implemented sibling files in the same layer (e.g. `categoriesStore.ts` if implementing `notesStore.ts`) to match coding patterns.

---

## Step 4 — Parse the test file

Read the test file and extract:

1. **Public API surface** — every named import is a function/type you must export
2. **Mocked dependencies** — `vi.mock(...)` calls define the only allowed imports in the source file
3. **Business rules** — every `// RN-xxx` comment maps a test case to a rule you must satisfy
4. **It-cases** — list all `it('should ...')` descriptions; each must be satisfiable by your implementation

---

## Step 5 — Implement the source file

Write `<feature>.ts` at the path derived from the test file name.

### TypeScript rules (non-negotiable)

- **Strict checking** — respect `noImplicitAny: true`; annotate function parameters and return types when not obvious
- **Prefer type inference** — do NOT annotate when the type is obvious from the literal or call (e.g. `const id = crypto.randomUUID()`, `const items = [] as Note[]`)
- **No `any`** — if you feel the urge to use `any`, use `unknown` instead and narrow with a type guard; if a test mock pattern seems to require `any`, flag it to the user and suggest a typed alternative
- **`unknown` for external data** — file contents, raw IPC payloads, and JSON.parse results are `unknown` until narrowed
- **Reuse shared types** — always check `src/main/types.ts` before defining a new type or interface
- **Export exactly what the test imports** — no extra exports; no hidden public surface

### Implementation rules

- Each function/class must carry a comment citing the RN-xxx rule(s) it satisfies (copy from the test)
- Depend only on the modules mocked in the test file — no hidden side-dependencies
- Follow the write-then-rename pattern (ADR-004) for any file writes
- Mirror the code style and patterns from existing store implementations

---

## Step 6 — Verification summary

After writing the file, output:

1. A table mapping each `it()` case → the function/block that satisfies it
2. The command to run: `npx vitest run <path/to/test.file.test.ts>`
3. Any RN-xxx rules referenced in the tests that required special handling or are worth double-checking

Do not stop until every `it()` case in the test file is addressed by the implementation.
