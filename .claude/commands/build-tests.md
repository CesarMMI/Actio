---
description: Generate TDD test suite for a NoteGraph feature, reading use cases from .claude/plans/ and mocking all dependencies.
---

You are generating a TDD test suite for the NoteGraph project (Electron + Vite + React + TypeScript + Vitest).

## Feature to Test
$ARGUMENTS

## Instructions

### 1. Read context first
Before writing any test, read the following plan documents to extract relevant use cases and rules for the requested feature:
- @.claude/plans/00_master_prd.md — product scope and feature goals
- @.claude/plans/01_regras_negocio.md — business rules (RN-xxx identifiers)
- @.claude/plans/03_modelo_dados.md — data shapes and lifecycle
- @.claude/plans/04_arquitetura.md — module structure, IPC contracts, main flows

Also read any existing source files related to the feature (even if empty) to understand intended module paths.

### 2. Identify all layers to test
Map the feature to the architecture layers from 04_arquitetura.md:
- `src/main/parser/` — pure functions, no deps (test first)
- `src/main/services/` — business logic with store/parser deps (mock all deps)
- `src/main/ipc/` — IPC handlers calling services (mock all services)
- `src/renderer/hooks/` — React hooks calling IPC wrappers (mock `window.electronAPI`)
- E2E flows — mark as `// TODO: implement once code exists`

### 3. Generate test files in order (unit → integration)

For each layer involved in the feature:
- Create one `.test.ts` (or `.test.tsx` for React hooks) file per module
- Mirror source path: `src/main/services/notes.ts` → `src/main/services/notes.test.ts`

### 4. Apply these rules in every test file

**AAA structure** (mandatory in every `it()` block):
```typescript
it('should <expected behavior>', () => {
  // Arrange
  const input = ...;
  const mockDep = vi.fn().mockResolvedValue(...);

  // Act
  const result = await subjectUnderTest(input);

  // Assert
  expect(result).toEqual(...);
  expect(mockDep).toHaveBeenCalledWith(...);
});
```

**Mocking** (mock everything outside the unit under test):
```typescript
vi.mock('../store/vault-store');
vi.mock('../parser/markdown-parser');
const mockReadFile = vi.mocked(readFile);
```

**Edge case coverage per business rule** — for every rule relevant to the feature, write:
- Happy path (rule satisfied)
- Boundary value (e.g. title exactly 50 chars, empty body, null category)
- Error case (invalid input, missing file, broken reference, duplicate)
- Cite the rule inline: `// RN-012: title max 50 chars`

**Do NOT**:
- Import real `fs` or Electron modules in service/parser tests
- Call actual IPC in renderer hook tests
- Skip the E2E placeholder — always include it even as a `TODO` block

### 5. Output format

For each test file produce:
1. A header with the full file path (e.g. `### src/main/parser/markdown-parser.test.ts`)
2. The complete TypeScript content (imports, `vi.mock()` calls, `describe` blocks, `it()` cases)
3. A one-line comment at the top of each `describe` block listing the RN-xxx rules it covers

Order: parser tests first → service tests → IPC handler tests → renderer hook tests → E2E placeholder last.

Do not stop until every layer relevant to the requested feature has a test file.
