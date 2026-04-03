---
name: backend
description: Use when implementing backend features, creating endpoints, services, repositories, entities, migrations, or any server-side code inside the backend/ directory.
---

# Backend Skill — NoteGraph API

## Stack

| Concern            | Choice                              |
|--------------------|--------------------------------------|
| Runtime            | Node.js (LTS)                        |
| Framework          | NestJS                               |
| Language           | TypeScript (strict — see rules/typescript.md) |
| Database           | SQLite (MVP) — must be swappable     |
| ORM                | TypeORM                              |
| Validation         | class-validator + class-transformer  |
| API Docs           | Swagger / OpenAPI (`@nestjs/swagger`) |
| Testing            | Jest                                 |
| Linting/Formatting | ESLint + Prettier (see rules/typescript.md) |

---

## Architecture — Clean Architecture

The backend follows Clean Architecture with four layers. Dependencies point **inward only**: api/infra → application → domain. The domain layer has **zero** external imports.

```
backend/src/
├── domain/                     # Enterprise business rules
│   ├── entities/               # Domain entities (plain classes, no decorators)
│   │   ├── note.entity.ts
│   │   ├── category.entity.ts
│   │   └── reference.entity.ts
│   ├── repositories/           # Repository interfaces (ports)
│   │   ├── note.repository.ts
│   │   └── category.repository.ts
│   ├── exceptions/             # Domain-specific exceptions
│   │   └── domain.exception.ts
│   └── value-objects/          # Value objects (optional, when applicable)
│
├── application/                # Application business rules (use cases)
│   ├── use-cases/
│   │   ├── notes/
│   │   │   ├── create-note.use-case.ts
│   │   │   ├── edit-note.use-case.ts
│   │   │   ├── delete-note.use-case.ts
│   │   │   ├── view-note.use-case.ts
│   │   │   └── list-notes.use-case.ts
│   │   ├── categories/
│   │   │   ├── create-category.use-case.ts
│   │   │   └── ...
│   │   ├── references/
│   │   │   ├── extract-references.use-case.ts
│   │   │   └── ...
│   │   └── search/
│   │       └── global-search.use-case.ts
│   ├── dtos/                   # Input/Output DTOs for use cases
│   │   ├── notes/
│   │   │   ├── create-note.dto.ts
│   │   │   └── ...
│   │   └── categories/
│   │       └── ...
│   └── exceptions/             # Application-level exceptions
│       └── application.exception.ts
│
├── api/                        # HTTP / REST layer (presentation)
│   ├── controllers/
│   │   ├── note.controller.ts
│   │   ├── category.controller.ts
│   │   └── reference.controller.ts
│   ├── filters/                # Exception filters (global error handling)
│   │   └── http-exception.filter.ts
│   ├── interceptors/
│   └── api.module.ts
│
├── infra/                      # Frameworks, drivers, external concerns
│   ├── database/
│   │   ├── typeorm/
│   │   │   ├── entities/       # TypeORM entity schemas (decorators here)
│   │   │   │   ├── note.schema.ts
│   │   │   │   ├── category.schema.ts
│   │   │   │   └── reference.schema.ts
│   │   │   ├── repositories/   # TypeORM repository implementations
│   │   │   │   ├── typeorm-note.repository.ts
│   │   │   │   └── typeorm-category.repository.ts
│   │   │   ├── migrations/
│   │   │   └── typeorm.config.ts
│   │   └── database.module.ts
│   └── infra.module.ts
│
├── shared/                     # Cross-cutting utilities (no business logic)
│   ├── utils/
│   └── constants/
│
├── main.ts
└── test/
    ├── unit/                   # Unit tests (mirror src/ structure)
    ├── integration/            # Integration/e2e tests
    └── helpers/                # Test factories, mocks, utilities
```

---

## Layer Rules

### Domain Layer

- **No imports** from `api/`, `application/`, `infra/`, or any external library (NestJS, TypeORM, etc.).
- Entities are **plain TypeScript classes** with business logic methods.
- Repository interfaces (ports) are defined here as **abstract classes** or **interfaces** prefixed with `I`.
- Domain exceptions extend a base `DomainException` class.
- All domain validation lives inside entities or value objects (e.g., title length, forbidden characters).

### Application Layer

- Depends **only** on `domain/`.
- Each use case is a **single class** with one public `execute()` method.
- Use cases receive repository interfaces via **constructor injection** — never concrete implementations.
- DTOs use `class-validator` decorators for input validation.
- DTOs use `@ApiProperty()` from `@nestjs/swagger` for documentation.
- Application exceptions extend a base `ApplicationException` class.

### API Layer

- Depends on `application/` (calls use cases) and `domain/` (reads DTOs/exceptions).
- **Does not** depend on `infra/` — controllers never access repositories or database concerns directly.
- Controllers are thin — they validate input (via DTO + pipe), call the use case, and return the result.
- Exception filters translate domain/application exceptions into HTTP responses.
- Dependency injection wiring for controllers and filters happens in `api.module.ts`.

### Infrastructure Layer

- Depends on `domain/` and `application/`.
- **TypeORM schemas** (`.schema.ts`) are separate files from domain entities — they map domain entities to database tables using TypeORM decorators.
- Repository implementations implement the domain interfaces and are suffixed with the technology (e.g., `TypeormNoteRepository implements INoteRepository`).
- Dependency injection wiring for database concerns happens in `infra.module.ts`.

---

## Database Strategy

- Use SQLite for MVP via TypeORM's `better-sqlite3` driver.
- The domain and application layers **never** reference SQLite or any specific database.
- Swapping the database means only changing `typeorm.config.ts` and the driver — no domain/application changes.
- Always use **migrations** — never `synchronize: true` in production config.
- Use `synchronize: true` only in test configuration.

---

## API Conventions

### Endpoints

- RESTful resource naming: plural nouns (e.g., `/notes`, `/categories`).
- Nested resources when there's a clear parent (e.g., `/notes/:id/references`).
- Use HTTP methods semantically: `GET` (read), `POST` (create), `PUT` (full update), `PATCH` (partial update), `DELETE` (remove).

### Response Format

- Success responses return the resource directly (no wrapping envelope).
- Error responses follow a consistent shape:

```json
{
  "statusCode": 400,
  "code": "NOTE_TITLE_EMPTY",
  "message": "Note title cannot be empty"
}
```

### Status Codes

| Action         | Success | Common Errors          |
|----------------|---------|------------------------|
| Create         | `201`   | `400` validation       |
| Read (single)  | `200`   | `404` not found        |
| Read (list)    | `200`   | —                      |
| Update         | `200`   | `400`, `404`           |
| Delete (check) | `200`   | `404`                  |
| Delete (confirm)| `204`  | `404`                  |

### Swagger

- Every controller must use `@ApiTags()`.
- Every endpoint must use `@ApiOperation()` and `@ApiResponse()`.
- Every DTO property must use `@ApiProperty()` (or `@ApiPropertyOptional()`).

---

## Testing Strategy

### Unit Tests

- Located in `test/unit/`, mirroring `src/` structure.
- Test **use cases** and **domain entities** in isolation.
- Mock all repository interfaces — never touch the database.
- File naming: `<name>.spec.ts`.
- Every use case must have unit tests covering: happy path, all validation errors, and edge cases.

### Integration Tests

- Located in `test/integration/`.
- Test the **full HTTP flow**: request → controller → use case → repository → database.
- Use an **in-memory SQLite** database for speed.
- File naming: `<name>.e2e-spec.ts`.
- Use `@nestjs/testing` to bootstrap the app module.
- Every endpoint must have integration tests covering: success, validation errors, not found, and relationship side effects.

### Test Helpers

- Create **factory functions** in `test/helpers/` to build test entities (e.g., `makeNote()`, `makeCategory()`).
- Create reusable setup/teardown utilities for database state.

---

## File Naming Conventions

| Type                    | Pattern                          | Example                              |
|-------------------------|----------------------------------|--------------------------------------|
| Domain entity           | `<name>.entity.ts`               | `note.entity.ts`                     |
| Domain repository port  | `<name>.repository.ts`           | `note.repository.ts`                 |
| Domain exception        | `<name>.exception.ts`            | `domain.exception.ts`                |
| Use case                | `<verb>-<noun>.use-case.ts`      | `create-note.use-case.ts`            |
| DTO                     | `<verb>-<noun>.dto.ts`           | `create-note.dto.ts`                 |
| TypeORM schema          | `<name>.schema.ts`               | `note.schema.ts`                     |
| TypeORM repository      | `typeorm-<name>.repository.ts`   | `typeorm-note.repository.ts`         |
| Controller              | `<name>.controller.ts`           | `note.controller.ts`                 |
| NestJS module           | `<name>.module.ts`               | `database.module.ts`                 |
| Filter/Interceptor      | `<name>.filter.ts`               | `http-exception.filter.ts`           |
| Unit test               | `<name>.spec.ts`                 | `create-note.use-case.spec.ts`       |
| Integration test        | `<name>.e2e-spec.ts`             | `note.e2e-spec.ts`                   |
| Migration               | `<timestamp>-<description>.ts`   | `1712000000000-create-notes-table.ts` |

---

## Implementation Checklist

When implementing a new feature, follow this order:

1. **Domain entity** — define or update the entity with its business rules.
2. **Domain repository interface** — define or update the port.
3. **Use case** — implement the application logic.
4. **DTO** — create input/output DTOs with validation and Swagger decorators.
5. **TypeORM schema** — map the entity to the database.
6. **TypeORM repository** — implement the port.
7. **Migration** — create the database migration if schema changed.
8. **Controller** — wire the HTTP endpoint.
9. **Module** — register providers and exports in the NestJS module.
10. **Unit tests** — test use case and domain logic.
11. **Integration tests** — test the full HTTP flow.
