---
name: backend-test
description: "Create tests for a backend feature following TDD. Tests are written BEFORE implementation. Usage: /project:backend-test <use-case-code>"
---

# TDD — Write Tests for Feature: $ARGUMENTS

## Context Loading

1. Read the business rules from `.claude/rules/entities.md` and `.claude/rules/use_cases.md`.
2. Read the backend skill from `.claude/skills/backend/SKILL.md`.
3. Identify the use case matching `$ARGUMENTS` (e.g., `UC-01`, `UC-03`).
4. If the use case is not found, stop and inform the user.

## Guiding Principles

- **Tests come first.** There is no implementation yet — do not assume any concrete class, method signature, or file exists.
- **Depend on abstractions.** Import only domain entities, repository interfaces (ports), DTOs, and exceptions. Never import concrete infrastructure classes.
- **Every test follows Arrange / Act / Assert** with clear comments separating each phase.
- **One test file per layer.** Create both unit and integration test files for the feature.
- **Do not create implementation files.** Only test files and, if needed, test helpers (factories, mocks).

## Test Generation Steps

### Step 1 — Analyze the Use Case

From the business rules, extract:
- All validation rules (e.g., title max length, required fields).
- Happy path flow.
- Error/edge cases (e.g., orphan links, cascading deletes).
- Side effects on other entities (e.g., references recalculated on note save).

List all scenarios before writing any code.

### Step 2 — Unit Tests

Create file at `backend/test/unit/<domain>/<use-case-name>.use-case.spec.ts`.

Structure:

```typescript
describe('<UseCaseName>UseCase', () => {
  describe('success', () => {
    it('should <happy path description>', () => {
      // Arrange — build input DTO and mock repository responses
      // Act — call useCase.execute(input)
      // Assert — verify returned value and repository interactions
    });
  });

  describe('validation', () => {
    it('should throw when <validation rule violated>', () => {
      // Arrange
      // Act & Assert — expect execute() to throw specific exception
    });
    // One test per validation rule from the use case
  });

  describe('side effects', () => {
    it('should <side effect description>', () => {
      // Arrange
      // Act
      // Assert — verify side effect (e.g., repository method called)
    });
  });
});
```

Rules for unit tests:
- Mock all repository interfaces — define mocks inline or use helpers from `test/helpers/`.
- Reference repository interfaces by their port type (e.g., `INoteRepository`), never by a concrete class.
- Use factory functions from `test/helpers/` to build entities. Create the factory if it doesn't exist.
- Test every validation rule listed in the use case as a separate `it()` block.
- Test every error path as a separate `it()` block.
- Assert on **behavior**, not on implementation details.

### Step 3 — Integration Tests

Create file at `backend/test/integration/<domain>/<resource>.e2e-spec.ts`.

Structure:

```typescript
describe('<Resource> — <HTTP Method> <endpoint>', () => {
  describe('success', () => {
    it('should return <status> with <expected body>', () => {
      // Arrange — seed database via repository
      // Act — send HTTP request via supertest
      // Assert — verify status code and response body
    });
  });

  describe('validation errors', () => {
    it('should return 400 when <rule violated>', () => {
      // Arrange
      // Act
      // Assert
    });
  });

  describe('not found', () => {
    it('should return 404 when <resource> does not exist', () => {
      // Arrange
      // Act
      // Assert
    });
  });

  describe('side effects', () => {
    it('should <verify database state after operation>', () => {
      // Arrange
      // Act
      // Assert — query database to verify side effect
    });
  });
});
```

Rules for integration tests:
- Bootstrap the NestJS app using `@nestjs/testing` with in-memory SQLite.
- Use `supertest` for HTTP requests.
- Seed and clean the database between tests.
- Verify both the HTTP response AND the database state when relevant.
- Test the same validation rules as unit tests, but through HTTP (verify status codes and error response shape).

### Step 4 — Test Helpers

If factory functions or mock utilities are needed and don't yet exist, create them in `backend/test/helpers/`:
- `make-note.ts` — factory for building Note entities with sensible defaults and overrides.
- `make-category.ts` — factory for Category entities.
- `make-reference.ts` — factory for Reference entities.
- `mock-repositories.ts` — reusable mock implementations of repository interfaces.

Factory pattern:

```typescript
export function makeNote(overrides: Partial<NoteProps> = {}): Note {
  return new Note({
    id: randomUUID(),
    title: 'Default Title',
    body: '',
    categoryId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });
}
```

## Output

After creating the test files, provide a summary:
- List of files created.
- Count of test scenarios per file.
- Any business rules from the use case that could NOT be tested without implementation details — flag these clearly.
