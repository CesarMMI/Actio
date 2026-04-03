# TypeScript — Coding Conventions

> Shared conventions for all TypeScript code across backend (NestJS) and frontend (Angular).

---

## Language & Strictness

- All code, comments, commits, and documentation must be written in **English**.
- TypeScript strict mode at maximum level:

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

- **Never** use `any`. Use `unknown` and narrow with type guards when the type is truly unknown.
- Prefer `interface` for object shapes. Use `type` only for unions, intersections, or mapped types.
- Always declare return types explicitly on public methods and exported functions.

---

## Style — OOP

- Use **classes** as the primary unit of organization.
- Favor **composition over inheritance** — prefer injecting dependencies over deep class hierarchies.
- Limit inheritance to **one level** unless there is a strong domain reason.
- Use `abstract` classes for shared behavior that must be extended.
- Use `readonly` on properties that should not be reassigned after construction.
- Keep classes focused — one responsibility per class (SRP).
- Use `private` by default. Escalate to `protected` or `public` only when necessary.

---

## Naming Conventions

| Element              | Convention         | Example                          |
|----------------------|--------------------|----------------------------------|
| Classes              | PascalCase         | `NoteService`, `CategoryEntity`  |
| Interfaces           | `I` + PascalCase   | `ICreateNoteInput`, `INoteRepository` |
| Type aliases         | PascalCase         | `ReferenceState`                 |
| Enums                | PascalCase         | `LinkStatus`                     |
| Enum members         | UPPER_SNAKE_CASE   | `ORPHAN_TOTAL`                   |
| Methods & functions  | camelCase          | `findById`, `extractReferences`  |
| Variables & params   | camelCase          | `noteId`, `displayText`          |
| Constants            | UPPER_SNAKE_CASE   | `MAX_TITLE_LENGTH`               |
| File names           | kebab-case         | `note.service.ts`, `create-note.dto.ts` |
| Folders              | kebab-case         | `use-cases/`, `shared/`          |
| Boolean variables    | `is`/`has`/`should` prefix | `isOrphan`, `hasCategory` |

- **Always** prefix interfaces with `I` (e.g. `INoteRepository`, not `NoteRepository`).
- **Do not** suffix types/interfaces with `Type` or `Interface`.

---

## Imports & Organization

- Use **path aliases** (e.g. `@app/...`, `@shared/...`) — avoid deep relative imports (`../../../`).
- Order imports in groups, separated by a blank line:
  1. External packages (`@nestjs/...`, `@angular/...`, `rxjs`, etc.)
  2. Internal aliases (`@app/...`, `@shared/...`)
  3. Relative imports (`./`, `../`)
- Remove all unused imports — ESLint enforces this.
- One class per file. Collocate closely related types (DTO, enum) only when they are small and exclusive to that file.

---

## Error Handling

- Use **throw/try-catch** as the primary error strategy.
- Define custom exception classes extending a base `AppException` (or framework equivalent like `HttpException` in NestJS).
- Every custom exception must include:
  - A machine-readable `code` (e.g. `NOTE_TITLE_EMPTY`).
  - A human-readable `message`.
- **Never** throw raw strings or generic `Error`. Always use typed exceptions.
- Catch exceptions at **boundary layers** (controllers, middleware, interceptors) — not inside business logic unless recovery is possible.
- Let unexpected errors propagate to a global handler.

---

## Linting & Formatting

- **ESLint** for static analysis — follow `@typescript-eslint/recommended` with strict type-checked rules enabled.
- **Prettier** for formatting — no manual style debates.
- Both must run on pre-commit (via lint-staged + husky or equivalent).
- Do not disable lint rules with inline comments unless there is a documented justification.

---

## General Rules

- Prefer `const` over `let`. Never use `var`.
- Use template literals over string concatenation.
- Use `===` and `!==` — never `==` or `!=`.
- Avoid magic numbers and strings — extract to named constants.
- Keep functions and methods short — if it exceeds ~30 lines, consider splitting.
- Use early returns to reduce nesting.
- Mark nullable values explicitly with `| null` — avoid `undefined` as a domain concept. Use `undefined` only for optional parameters/properties.
