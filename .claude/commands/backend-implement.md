---
name: backend-implement
description: "Implement a backend feature to make existing tests pass (TDD). Usage: /project:backend-implement <use-case-code>"
---

# TDD — Implement Feature: $ARGUMENTS

## Context Loading

1. Read the backend skill from `.claude/skills/backend/SKILL.md`.
2. Read the business rules from `.claude/rules/entities.md` and `.claude/rules/use_cases.md`.
3. Identify the use case matching `$ARGUMENTS` (e.g., `UC-01`, `UC-03`).
4. If the use case is not found, stop and inform the user.
5. Find all test files related to this feature:
   - Search `backend/test/unit/` for matching spec files.
   - Search `backend/test/integration/` for matching e2e-spec files.
6. If no test files are found, stop and inform the user: _"No tests found for this feature. Run `/project:backend-test $ARGUMENTS` first."_

## Guiding Principles

- **Make the tests pass.** The tests define the expected behavior — implement to satisfy them, never modify tests to match implementation.
- **If the tests are wrong, stop and flag it.** Do not silently fix or adjust test expectations.
- **One type per file.** Each class (entity, use case, DTO, exception, schema, repository, controller) lives in its own file. Never combine multiple types in a single file.
- **Follow the implementation checklist** from the backend skill (domain → application → infra → api).
- **Flag uncovered behavior.** If the use case requires behavior that has no corresponding test, do NOT implement it. Instead, list it at the end under "Uncovered Behavior" so the user can add tests first.

## Implementation Steps

### Step 1 — Analyze Tests

Read all test files for this feature and extract:
- Which classes and methods the tests expect to exist (e.g., `CreateNoteUseCase.execute()`).
- Which repository interface methods are mocked (e.g., `save()`, `findById()`).
- Which exceptions the tests expect to be thrown.
- Which DTOs and their properties the tests reference.
- Which HTTP endpoints and status codes the integration tests expect.

List the implementation plan before writing any code.

### Step 2 — Domain Layer

Following the order: entities → repository interfaces → exceptions.

- Create or update domain entities as **plain TypeScript classes** (no decorators).
- Include business validation methods that the tests assert (e.g., title length check).
- Create or update repository interfaces (ports) with the methods the tests mock.
- Create domain exceptions that the tests expect to be thrown.

### Step 3 — Application Layer

Following the order: DTOs → use cases → application exceptions.

- Create DTOs with `class-validator` decorators and `@ApiProperty()`.
- Create use cases with a single `execute()` method.
- Inject repository interfaces via constructor — use the exact interface names the tests reference.
- Implement only the logic that the tests verify. If a business rule from the use case document has no test, add it to the "Uncovered Behavior" list instead.

### Step 4 — Infrastructure Layer

Following the order: TypeORM schemas → TypeORM repositories → migrations → module.

- Create TypeORM schemas (`.schema.ts`) mapping domain entities to tables.
- Create TypeORM repository implementations that fulfill the domain interfaces.
- Create or update database migrations if schema changed.
- Wire everything in `infra.module.ts`.

### Step 5 — API Layer

Following the order: controllers → filters → module.

- Create controllers that match the endpoints the integration tests expect.
- Use the exact routes, HTTP methods, and status codes from the tests.
- Wire everything in `api.module.ts`.

### Step 6 — Run Tests

After implementation is complete:
1. Run `npm test -- --testPathPattern=<unit-test-file>` to verify unit tests.
2. Run `npm test -- --testPathPattern=<integration-test-file>` to verify integration tests.
3. If any test fails, fix the **implementation** (not the test) and re-run.

## Output

After completing the implementation, provide:

### Files Created
List every file created or modified, grouped by layer.

### Test Results
- Number of tests passing.
- Number of tests failing (if any, with explanation of what needs to change).

### Uncovered Behavior
List any business rules from the use case that:
- Have no corresponding test.
- Were NOT implemented (waiting for tests).

Format:
```
⚠️ Uncovered Behavior:
- <UC-XX rule>: "<description of the rule>" — No test covers this. Add a test with /project:backend-test before implementing.
```

If there is no uncovered behavior, confirm: _"All use case rules are covered by tests and implemented."_
