---
name: build-backend
description: Build, scaffold, or implement TypeScript + Express.js + TypeORM backend features, use cases, or modules following DDD and TDD. Use when the user asks to create or modify backend routes, use cases, domain entities, repositories, or error handling.
argument-hint: "[what to build, e.g. 'create task use case', 'project routes', 'context repository']"
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
│   ├── di-container/        # DI primitives: Injectable, DiContainer, Injector
│   ├── domain/              # Pure domain: entities, value objects, domain errors
│   │   ├── entities/
│   │   ├── errors/
│   │   └── interfaces/      # Repository port interfaces + Injectable tokens
│   ├── application/         # Use cases (one file per use case)
│   │   ├── use-cases/
│   │   ├── interfaces/      # Use-case interfaces + Injectable tokens (one file per use case)
│   │   ├── types/           # Input/output plain types (inputs/, outputs/)
│   │   └── di.ts            # Application injector: resolves repos, binds use cases
│   ├── infrastructure/      # TypeORM entities, repository implementations, DataSource
│   │   ├── database/
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── di.ts            # Infrastructure injector: initializes DataSource, binds repos
│   └── api/                 # Express controllers, middleware, error mapper
│       ├── controllers/     # Controller classes implementing IController
│       ├── interfaces/      # IController interface + CONTROLLERS token
│       ├── middleware/
│       └── di.ts            # API injector: bindMany controllers, loop registerRoutes
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

### Strict Mode Config

Enable all of the following in `tsconfig.json`. Never disable them.

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true
  }
}
```

### Core Rules

- **No `any`.** Use `unknown` when the type is uncertain; narrow it before use.
- **Prefer inference.** Only annotate when the type is not obvious or the inference is wrong.
- **`readonly` by default** on entity properties that must not change after construction.
- **Never widen a type to silence an error.** Fix the root cause instead.

### `type` vs `interface`

| Use `interface` when… | Use `type` when… |
|-----------------------|-----------------|
| Defining a contract (repository ports, use-case interfaces) — extendable | Creating a union, intersection, or alias |
| You want declaration merging | You need mapped types, conditional types, or template literal types |
| Describing a class shape | The type is not an object (e.g., `type Id = string`) |

- Use `interface` for contracts (repository ports, use-case inputs/outputs) — they are extendable.
- Use `type` for input/output shapes, unions, and intersections.

### Type Narrowing & Guards

```typescript
// typeof
function process(value: string | number) {
  if (typeof value === 'string') return value.toUpperCase();
  return value.toFixed(2);
}

// instanceof — use for domain error handling
if (err instanceof TaskNotFoundError) { /* err is TaskNotFoundError */ }

// in operator
if ('message' in value) { /* value has a 'message' property */ }

// Custom type predicate
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null && 'id' in value;
}

// Exhaustive check with never
type Shape = Circle | Square;
function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'square': return shape.side ** 2;
    default: {
      const _exhaustive: never = shape; // compile error if a case is missing
      throw new Error(`Unhandled shape: ${_exhaustive}`);
    }
  }
}
```

### Generics

Add `<T>` when the same logic applies to multiple types and the specific type should be decided by the caller. Directly relevant to `IRepository<T>`, `IUseCase<TInput, TOutput>`, `Injectable<T>`, `DiContainer`.

```typescript
function first<T>(items: T[]): T | undefined { return items[0]; }

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] { return obj[key]; }
```

### Utility Types

| Utility | Effect |
|---------|--------|
| `Partial<T>` | All properties optional |
| `Required<T>` | All properties required |
| `Readonly<T>` | All properties `readonly` (shallow) |
| `Pick<T, K>` | Keep only properties `K` |
| `Omit<T, K>` | Remove properties `K` |
| `Record<K, V>` | Object with keys `K` and values `V` |
| `NonNullable<T>` | Remove `null` and `undefined` |
| `ReturnType<F>` | Extract return type of `F` |
| `Parameters<F>` | Extract parameter tuple of `F` |
| `Awaited<T>` | Unwrap `Promise<T>` to `T` |
| `Extract<T, U>` | Keep members of `T` assignable to `U` |
| `Exclude<T, U>` | Remove members of `T` assignable to `U` |

```typescript
type UpdateInput = Partial<Omit<User, 'id' | 'createdAt'>>;
```

### Discriminated Unions

Use a literal `kind` (or `type`) field as the discriminant.

```typescript
type Result<T, E extends Error = Error> =
  | { ok: true;  value: T }
  | { ok: false; error: E };

type LoadState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error';   error: string };
```

### Branded / Opaque Types

Prevent accidentally mixing semantically different `string` values (e.g., `TaskId` vs `ProjectId`).

```typescript
type TaskId    = string & { readonly _brand: 'TaskId' };
type ProjectId = string & { readonly _brand: 'ProjectId' };

function createTaskId(raw: string): TaskId { return raw as TaskId; }

function getTask(id: TaskId): Task { /* ... */ }

const pid = createProjectId('p-1');
getTask(pid); // TS error — ProjectId is not assignable to TaskId
```

### Readonly & Immutability

```typescript
// readonly modifier
interface Config { readonly apiUrl: string; }

// as const — narrows literal types
const DIRECTIONS = ['north', 'south', 'east', 'west'] as const;
type Direction = typeof DIRECTIONS[number];

// ReadonlyArray<T>
function sum(numbers: ReadonlyArray<number>): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}
```

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

## Dependency Injection

The DI system is **manual, symbol-based, and explicit** — no decorators, no reflection.

### The three primitives

```typescript
// di-container/di-container-injectable.ts
export class Injectable<T> {
  readonly token: symbol;
  constructor(token: string) { this.token = Symbol(token); }
}

// di-container/di-container.ts
export class DiContainer {
  private readonly bindings = new Map<symbol, unknown>();
  // Bind a single instance
  bind<T>(injectable: Injectable<T>, instance: T): void {
    this.bindings.set(injectable.token, instance);
  }
  // Accumulate instances into an array (e.g. CONTROLLERS)
  bindMany<T>(injectable: Injectable<T[]>, instance: T): void {
    const existing = this.bindings.get(injectable.token) as T[] | undefined;
    if (existing) { existing.push(instance); }
    else { this.bindings.set(injectable.token, [instance]); }
  }
  resolve<T>(injectable: Injectable<T>): T {
    const instance = this.bindings.get(injectable.token);
    if (!instance) throw new Error(`No binding found for ${injectable.token.toString()}`);
    return instance as T;
  }
}

// di-container/di-container-injector.ts
export interface Injector {
  (container: DiContainer, env: NodeJS.ProcessEnv): Promise<DiContainer>;
}
```

### The three-layer injector chain

| Layer | File | Responsibility |
|-------|------|----------------|
| Infrastructure | `infrastructure/di.ts` | Initialize DataSource; bind repository implementations |
| Application | `application/di.ts` | Resolve repositories; instantiate + bind use cases |
| API | `api/di.ts` | Resolve use cases; mount Express routers |

`src/index.ts` chains them: `injectInfrastructure(container, env)` → `injectApplication` → `injectApi`.

### Token declaration patterns

Every interface exports an `Injectable<T>` constant in the same file as the interface:

```typescript
// domain/interfaces/task-repository.interface.ts
import { Injectable } from '../../di-container/di-container-injectable';

export const TASK_REPOSITORY = new Injectable<ITaskRepository>('ITaskRepository');

export interface ITaskRepository extends IRepository<Task> {
  findByProjectId(projectId: string): Promise<Task[]>;
  // ...
}
```

```typescript
// application/interfaces/task/create-task.use-case.interface.ts
import { Injectable } from '../../../di-container/di-container-injectable';
import type { IUseCase } from '../use-case.interface';

export const CREATE_TASK_USE_CASE = new Injectable<ICreateTaskUseCase>('ICreateTaskUseCase');

export interface ICreateTaskUseCase extends IUseCase<CreateTaskInput, CreateTaskOutput> {}
```

### Base interfaces

- `IRepository<T>` — `domain/interfaces/repository.interface.ts`: `save`, `findById`, `findAll`, `delete`
- `IUseCase<TInput, TOutput>` — `application/interfaces/use-case.interface.ts`: `execute(input): Promise<TOutput>`

---

## TDD Workflow

> **Plans first. Tests second. Implementation third.**

0. **Read the plan docs** (prd, data-modeling, use-cases). Gate: if the feature has no use case in the plan, stop.
1. **Scaffold the minimum** to make the test file compile (types, error stubs, use-case skeleton with `throw new Error('not implemented')`).
2. **Write tests** derived directly from the plan's use case spec (one `it` per output/failure row) — confirm red.
3. **Implement** layer by layer until tests pass (green).
4. **Type-check** with `tsc --noEmit` — fix all errors.
5. **Run the full suite** (`npx jest`) — all tests must pass.

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
// application/interfaces/task/create-task.use-case.interface.ts
import { Injectable } from '../../../di-container/di-container-injectable';
import type { IUseCase } from '../use-case.interface';
import type { CreateTaskInput } from '../../types/inputs/task/create-task.input';
import type { CreateTaskOutput } from '../../types/outputs/task/create-task.output';

export const CREATE_TASK_USE_CASE = new Injectable<ICreateTaskUseCase>('ICreateTaskUseCase');

export interface ICreateTaskUseCase extends IUseCase<CreateTaskInput, CreateTaskOutput> {}
```

```typescript
// application/use-cases/task/create-task.use-case.ts
import { ITaskRepository } from '../../../domain/interfaces/task-repository.interface';
import { Task } from '../../../domain/entities/task/task.entity';
import { ICreateTaskUseCase } from '../../interfaces/task/create-task.use-case.interface';
import type { CreateTaskInput } from '../../types/inputs/task/create-task.input';
import type { CreateTaskOutput } from '../../types/outputs/task/create-task.output';

export class CreateTaskUseCase implements ICreateTaskUseCase {
  constructor(private readonly tasks: ITaskRepository) {}

  async execute(input: CreateTaskInput): Promise<CreateTaskOutput> {
    const task = Task.create(input);
    await this.tasks.save(task);
    return { task };
  }
}
```

### DataSource

```typescript
// infrastructure/database/sqlite.data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { FooOrmEntity } from '../entities/foo.orm-entity';

export class SqliteDataSource extends DataSource {
  constructor(env: NodeJS.ProcessEnv) {
    super({
      type: 'sqljs',
      location: env.DB_PATH ?? 'actio.sqlite',
      autoSave: true,
      entities: [FooOrmEntity],
      synchronize: env.NODE_ENV !== 'production',
    });
  }
}
```

### Express controller

```typescript
// api/interfaces/controller.interface.ts
import { Router } from 'express';
import { Injectable } from '../../di-container/di-container-injectable';

export const CONTROLLERS = new Injectable<IController[]>('IControllers');

export interface IController {
  readonly basePath: string;
  registerRoutes(router: Router): void;
}
```

```typescript
// api/controllers/task.controller.ts
import { Router, Request, Response, NextFunction } from 'express';
import { IController } from '../interfaces/controller.interface';
import { ICreateTaskUseCase } from '../../application/interfaces/task/create-task.use-case.interface';

export class TaskController implements IController {
  readonly basePath = '/tasks';

  constructor(private readonly createTask: ICreateTaskUseCase) {}

  registerRoutes(router: Router): void {
    router.post('/', this.create.bind(this));
  }

  private async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(201).json(await this.createTask.execute(req.body));
    } catch (err) {
      next(err);
    }
  }
}
```

In `api/di.ts`, register each controller with `bindMany`, then loop to mount them:

```typescript
container.bindMany(CONTROLLERS, new TaskController(container.resolve(CREATE_TASK_USE_CASE)));
container.bindMany(CONTROLLERS, new ProjectController(container.resolve(CREATE_PROJECT_USE_CASE)));

for (const controller of container.resolve(CONTROLLERS)) {
  const router = Router();
  controller.registerRoutes(router);
  app.use(controller.basePath, router);
}
```

---

## Implementation Instructions

When the user asks you to implement `$ARGUMENTS`:

0. **Read the plan docs first — always, before anything else.**
   Read all three files:
   - `.claude/plans/prd.plan.md`
   - `.claude/plans/data-modeling.plan.md`
   - `.claude/plans/use-cases.plan.md`

1. **Check the plan covers this feature.**
   Identify which Use Case IDs (UC-Xxx) correspond to what was asked. If the feature is a domain behavior and no matching use case exists in `use-cases.plan.md`, **stop immediately**: warn the user that this feature is not specified in the plans and exit without writing any code.

2. **Read existing code.** Use Glob and Read to understand what already exists. Do not duplicate or overwrite work.

3. **Scaffold the minimum to compile tests.** Create only what the test file needs to compile and run:
   - Input/output type interfaces (`application/types/inputs/`, `application/types/outputs/`)
   - Domain error class stubs if missing
   - Use-case class skeleton: constructor + `execute` that throws `new Error('not implemented')`
   - In-memory mock repository if one doesn't exist yet

   Do NOT implement business logic yet.

3a. **Declare the interface + token.**
   - New repository → add `Injectable` export + `interface` in `domain/interfaces/<domain>-repository.interface.ts`, extending `IRepository<Entity>`.
   - New use case → add `Injectable` export + `interface` extending `IUseCase<Input, Output>` in `application/interfaces/<domain>/<action>.use-case.interface.ts`.

3b. **Bind in the correct `di.ts`.**
   - Repository implementation → `infrastructure/di.ts`: `container.bind(REPO_TOKEN, new TypeOrmXxxRepository(dataSource))`
   - Use case → `application/di.ts`: resolve required repos, then `container.bind(USE_CASE_TOKEN, new XxxUseCase(repo, ...))`

3c. **Resolve in `api/di.ts`.**
   When mounting a new route, `container.resolve(NEW_USE_CASE_TOKEN)` and pass to the router factory.

4. **Write tests (red phase).** Derive every `it(...)` directly from the plan spec:
   - One test per happy path output described in the use case
   - One test per failure case row in the use case table

   Run: `cd backend && npx jest --testPathPattern=<spec-file>` — confirm all fail (red).

5. **Implement to pass tests (green phase).** Work layer by layer:
   - `domain/` → `application/` → `infrastructure/` → `api/`

   Run the spec after each layer until all tests pass (green).

6. **Type-check.**
   ```
   cd backend && npx tsc --noEmit
   ```
   Fix any type errors before continuing.

7. **Run the full test suite.**
   ```
   cd backend && npx jest
   ```
   All tests must pass. Fix any regressions before finishing.

8. **Update `backend/src/api/openapi.yaml`.**
   After all tests pass, update the OpenAPI spec to reflect any changes made to endpoints, request bodies, or responses. This file is the source of truth for the API contract — it must always stay in sync with the controllers.

   **When to update:**
   - A new route was added → add the path + operation under `paths`.
   - A route was removed → remove its path/operation from `paths`.
   - A request body shape changed → update the `requestBody` schema for that operation.
   - A response shape changed → update the relevant response schema or `$ref`.
   - A new domain entity was introduced or an existing one gained/lost fields → update `components/schemas`.
   - A new error response is possible (e.g., a use case can now throw a new domain error) → add the status code and `$ref` to the operation's `responses`.

   **Rules for the YAML:**
   - Every operation must have a `summary` referencing the Use Case ID from the plan (e.g., `UC-T01 — Create Task`).
   - Every operation must have an `operationId` in camelCase matching the controller method name (e.g., `createTask`).
   - Reuse `$ref: '#/components/schemas/Xxx'` for entity shapes — do not inline them per-operation.
   - Reuse `$ref: '#/components/responses/NotFound'` (and other shared responses in `components/responses`) for common error shapes.
   - HTTP status codes in `responses` must exactly match what `res.status(N)` the controller actually sends.
   - Nullable fields must be marked `nullable: true`.
   - Required fields must be listed under `required: [...]`.
   - Path parameters must be declared under the path-level `parameters` block, not per-operation.

9. **Follow strict layer boundaries.** Domain must not import from infrastructure or API. Application must not import from infrastructure or API. Infrastructure imports domain. API imports application and infrastructure (for DI only).

9. **One file per thing.** Never put two classes, two interfaces, or two use cases in the same file.

10. **No `any`.** If TypeScript inference fails, use `unknown` and narrow explicitly.

11. **Keep it minimal.** Only implement what was asked. No extra abstractions, no placeholder features, no TODO stubs.
