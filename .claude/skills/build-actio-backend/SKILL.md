---
name: build-actio-backend
description: Build, scaffold, or implement TypeScript + Express.js + TypeORM backend features, use cases, or modules following DDD and TDD. Use when the user asks to create or modify backend routes, use cases, domain entities, repositories, or error handling.
argument-hint: "[what to build, e.g. 'create task use case', 'project routes', 'context repository']"
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, Agent
---

# Actio Backend — Build Skill

You are implementing the **Actio backend**, a TypeScript + Express.js + TypeORM API following **DDD** and **TDD**.

## Stack

| Layer          | Technology                              |
|----------------|-----------------------------------------|
| Language       | TypeScript (strict mode)                |
| HTTP framework | Express.js                              |
| ORM            | TypeORM                                 |
| Database       | SQLite (swappable via DataSource config)|
| Test runner    | Jest                                    |

---

## Folder Structure

```
backend/
├── src/
│   ├── domain/              # Pure domain: entities, value objects, domain errors
│   │   ├── entities/
│   │   ├── errors/
│   │   └── interfaces/      # Repository port interfaces
│   ├── application/         # Use cases (one file per use case)
│   │   ├── use-cases/
│   │   └── interfaces/      # Use-case input/output types
│   ├── infrastructure/      # TypeORM entities, repository implementations, DataSource
│   │   ├── database/
│   │   ├── entities/
│   │   └── repositories/
│   └── api/                 # Express routes, controllers, DTOs, error mapper
│       ├── routes/
│       ├── controllers/
│       ├── dto/
│       └── di-container/
└── tests/                   # Mirrors src/ structure exactly
    ├── domain/
    │   └── entities/        # Entity unit tests
    ├── application/
    │   ├── use-cases/       # Use-case unit tests
    │   └── mocks/           # In-memory repository implementations
    ├── infrastructure/
    │   └── repositories/    # Repository integration tests
    └── api/
        └── routes/          # HTTP route integration tests
```

> **One thing per file.** A file must never contain two classes, two interfaces, or two use cases.

---

## TypeScript Rules

- Enable `strict: true` in `tsconfig.json` — never disable it.
- **Prefer type inference** when the type is obvious (e.g., `const id = uuid()` — no need to annotate `string`).
- **Never use `any`.** Use `unknown` when the type is uncertain; narrow it before use.
- Use **interfaces** over concrete classes for contracts (repository ports, use-case inputs/outputs).
- Use `readonly` on properties that should not be reassigned after construction.

---

## Architecture Rules

### Domain layer (pure)
- No TypeORM decorators. No Express. No DB imports.
- Entities are plain classes with behavior methods that enforce invariants.
- Invariant violations throw typed **domain error classes** (see Error Handling).
- Repository contracts are **interfaces** defined in `domain/interfaces/` — never depend on TypeORM here.

### Application layer (use cases)
- Each use case is a class with a single `execute(input)` method.
- Use cases depend on repository **interfaces** injected via the constructor.
- No HTTP, no TypeORM, no Express in this layer.
- Input and output types are plain interfaces in `application/interfaces/`.

### Infrastructure layer (implementations)
- TypeORM entity classes live here (decorated with `@Entity`, `@Column`, etc.).
- Repository classes implement the domain interfaces using TypeORM `Repository<T>`.
- `DataSource` is configured in a single file: `infrastructure/database/data-source.ts`.
  - To swap SQLite for Postgres: only this file changes.

### API layer (thin)
- Controllers parse HTTP request, call the use case, and return the HTTP response.
- No business logic in routes or controllers.
- DTOs validate incoming data before handing off to use cases.
- A central error mapper converts domain/application errors to RFC 7807 responses.

---

## TDD Workflow

> **Tests come first. Implementation follows tests.**

1. **Read the use case spec** in `.claude/plans/use-cases.plan.md` for the feature being built.
2. **Write the test file** that covers every case (happy path + all failure cases) described in the spec.
3. Run tests — they must **fail** (red).
4. Implement the minimum code to make tests pass (green).
5. Refactor if needed, keeping tests green.
6. **Run tests after every code change.** Never leave tests unrun.

### Test locations

Tests live under `backend/tests/` and mirror the `backend/src/` tree exactly. Given a source file at `src/a/b/foo.ts`, its test lives at `tests/a/b/foo.spec.ts`.

| What to test          | Source file                                        | Test file                                           |
|-----------------------|----------------------------------------------------|-----------------------------------------------------|
| Domain entity         | `src/domain/entities/task.entity.ts`               | `tests/domain/entities/task.entity.spec.ts`         |
| Use case              | `src/application/use-cases/create-task.use-case.ts`| `tests/application/use-cases/create-task.use-case.spec.ts` |
| Repository (infra)    | `src/infrastructure/repositories/task.repository.ts` | `tests/infrastructure/repositories/task.repository.spec.ts` |
| API route             | `src/api/routes/task.routes.ts`                    | `tests/api/routes/task.routes.spec.ts`              |

In-memory mock repositories used across use-case tests live in `tests/application/mocks/`.

### Use-case test pattern

```typescript
// tests/application/use-cases/create-task.use-case.spec.ts
import { CreateTaskUseCase } from '../../../src/application/use-cases/create-task.use-case';
import { InMemoryTaskRepository } from '../mocks/in-memory-task.repository';

describe('UC-T01 — Create Task', () => {
  let useCase: CreateTaskUseCase;
  let repo: InMemoryTaskRepository;

  beforeEach(() => {
    repo = new InMemoryTaskRepository();
    useCase = new CreateTaskUseCase(repo);
  });

  it('creates a task with a valid description', async () => {
    const result = await useCase.execute({ description: 'Buy milk' });
    expect(result.description).toBe('Buy milk');
    expect(result.id).toBeDefined();
  });

  it('rejects an empty description', async () => {
    await expect(useCase.execute({ description: '   ' }))
      .rejects.toThrow(InvalidTaskDescriptionError);
  });
});
```

---

## Error Handling

### Domain errors — one class per error

Each error is a class in `domain/errors/`. This makes errors easy to `instanceof`-check and traceable in production logs.

```typescript
// domain/errors/invalid-task-description.error.ts
export class InvalidTaskDescriptionError extends Error {
  readonly code = 'INVALID_TASK_DESCRIPTION';
  constructor() {
    super('Task description must not be empty.');
    this.name = 'InvalidTaskDescriptionError';
  }
}

// domain/errors/task-not-found.error.ts
export class TaskNotFoundError extends Error {
  readonly code = 'TASK_NOT_FOUND';
  constructor(id: string) {
    super(`Task with id "${id}" was not found.`);
    this.name = 'TaskNotFoundError';
  }
}
```

### RFC 7807 error responses

All HTTP error responses follow [RFC 7807 Problem Details](https://www.rfc-editor.org/rfc/rfc7807):

```json
{
  "type": "https://actio.app/errors/task-not-found",
  "title": "Task Not Found",
  "status": 404,
  "detail": "Task with id \"abc-123\" was not found.",
  "instance": "/api/tasks/abc-123"
}
```

A central **error mapper** in `api/` converts domain error classes to Problem Details responses:

```typescript
// api/error-mapper.ts
import { Request, Response } from 'express';
import { TaskNotFoundError } from '../domain/errors/task-not-found.error';
import { InvalidTaskDescriptionError } from '../domain/errors/invalid-task-description.error';

export function handleError(err: unknown, req: Request, res: Response): void {
  if (err instanceof TaskNotFoundError) {
    res.status(404).json({
      type: 'https://actio.app/errors/task-not-found',
      title: 'Task Not Found',
      status: 404,
      detail: err.message,
      instance: req.path,
    });
    return;
  }

  if (err instanceof InvalidTaskDescriptionError) {
    res.status(422).json({
      type: 'https://actio.app/errors/invalid-task-description',
      title: 'Invalid Task Description',
      status: 422,
      detail: err.message,
      instance: req.path,
    });
    return;
  }

  // Fallback — unexpected error
  res.status(500).json({
    type: 'https://actio.app/errors/internal-server-error',
    title: 'Internal Server Error',
    status: 500,
    detail: 'An unexpected error occurred.',
    instance: req.path,
  });
}
```

---

## Common Patterns

### Repository interface (domain layer)

```typescript
// domain/interfaces/ITaskRepository.ts
export interface ITaskRepository {
  save(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAll(): Promise<Task[]>;
  delete(id: string): Promise<void>;
}
```

### Use case

```typescript
// application/use-cases/create-task.use-case.ts
import { ITaskRepository } from '../../domain/interfaces/ITaskRepository';
import { Task } from '../../domain/entities/task.entity';
import { InvalidTaskDescriptionError } from '../../domain/errors/invalid-task-description.error';
import type { CreateTaskInput } from '../interfaces/task/create-task.input';

export class CreateTaskUseCase {
  constructor(private readonly tasks: ITaskRepository) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    if (!input.description.trim()) throw new InvalidTaskDescriptionError();
    const task = Task.create(input);
    return this.tasks.save(task);
  }
}
```

### TypeORM DataSource

```typescript
// infrastructure/database/data-source.ts
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB_PATH ?? 'actio.sqlite',
  entities: [/* TypeORM entity classes */],
  synchronize: process.env.NODE_ENV !== 'production',
});
// To swap DB: change `type`, `database`, add host/port/credentials.
```

### Express controller

```typescript
// api/controllers/task.controller.ts
import { Request, Response } from 'express';
import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case';
import { handleError } from '../error-mapper';

export class TaskController {
  constructor(private readonly createTask: CreateTaskUseCase) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const task = await this.createTask.execute(req.body);
      res.status(201).json(task);
    } catch (err) {
      handleError(err, req, res);
    }
  }
}
```

---

## Implementation Instructions

When the user asks you to implement `$ARGUMENTS`:

1. **Read existing code first.** Use Glob and Read to understand what already exists. Do not duplicate or overwrite work.

2. **Read the use-case spec.** Open `.claude/plans/use-cases.plan.md` and locate the relevant UC(s). Every input, precondition, output, and failure case in the spec must be covered by a test.

3. **Write tests first (TDD).** Create or update test files before touching implementation files. Tests must fail initially.

4. **Run tests.** Execute `cd backend && npx jest --testPathPattern=<relevant-spec>` (or the full suite) to confirm red.

5. **Implement the minimum code** to make the tests pass, layer by layer:
   - `domain/` → `application/` → `infrastructure/` → `api/`

6. **Run tests again.** Confirm green. Never leave tests unrun after a code change.

7. **Follow strict layer boundaries.** Domain must not import from infrastructure or API. Application must not import from infrastructure or API. Infrastructure imports domain. API imports application and infrastructure (for DI only).

8. **One file per thing.** Never put two classes, two interfaces, or two use cases in the same file.

9. **No `any`.** If TypeScript inference fails, use `unknown` and narrow explicitly.

10. **Keep it minimal.** Only implement what was asked. No extra abstractions, no placeholder features, no TODO stubs.
