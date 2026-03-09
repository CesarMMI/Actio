---
name: build-actio
description: Implement a feature, layer, or module of the Actio GTD app. Use when the user asks to build, implement, scaffold, or add something to the Actio project.
argument-hint: "[what to build, e.g. 'backend entities', 'inbox API', 'angular capture form']"
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, Agent
---

# Actio — Build Skill

You are implementing **Actio**, a minimalist GTD task-management app.

## Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | Angular 22+ (standalone components, signals)    |
| Backend    | Express.js + TypeScript                         |
| ORM        | TypeORM                                         |
| Database   | SQLite (v1) — swappable via DataSource config   |

## Project Layout

```
/
├── backend/
│   ├── src/
│   │   ├── domain/          # Pure domain: entities, enums, domain errors
│   │   ├── application/     # Use cases (one file per UC)
│   │   ├── infrastructure/  # TypeORM entities, repositories, DataSource
│   │   └── api/             # Express routes, controllers, DTOs
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── core/        # Services, DI tokens
    │   │   ├── features/    # inbox/, actions/, projects/, contexts/
    │   │   └── shared/      # Reusable UI components
    │   └── main.ts
    ├── package.json
    └── angular.json
```

---

## Domain Model (canonical reference)

### Entities & Enums

**CapturedItem**
- `id` (UUID), `title` (string, required), `notes` (string, optional), `status` (CapturedItemStatus, default: INBOX), `createdAt`
- Status: `INBOX | CLARIFIED_AS_ACTION | CLARIFIED_AS_PROJECT | REFERENCE | SOMEDAY | TRASH`
- Behavior: `clarifyAsAction | clarifyAsProject | clarifyAsReference | clarifyAsSomeday | moveToTrash` — all only valid when status is INBOX. Terminal once resolved.

**Action**
- `id`, `title` (required), `notes` (optional), `dueDate` (optional), `timeBucket` (optional), `energyLevel` (optional), `status` (ActionStatus, default: OPEN), `project?`, `context?`, `createdAt`
- Status: `OPEN | COMPLETED | ARCHIVED`
- Behavior: `complete` (OPEN→COMPLETED), `archive` (COMPLETED→ARCHIVED)
- Belongs to at most one Project and at most one Context.

**Project**
- `id`, `name` (required, mutable), `description` (optional), `status` (ProjectStatus, default: ACTIVE), `createdAt`
- Status: `ACTIVE | COMPLETED | ARCHIVED`
- Behavior: `rename`, `complete` (only if all actions are COMPLETED|ARCHIVED), `archive` (COMPLETED→ARCHIVED)

**Context**
- `id`, `name` (required, mutable), `description` (optional), `active` (boolean, default: true), `createdAt`
- Behavior: `rename`, `activate`, `deactivate`

**Enums**
- `TimeBucket`: `short | medium | long`
- `EnergyLevel`: `low | medium | high`

---

## Use Cases (UC reference)

| UC    | Name                          | Key rule                                             |
|-------|-------------------------------|------------------------------------------------------|
| UC-01 | Quick Capture                 | Creates CapturedItem with status INBOX               |
| UC-02 | Capture + Resolve Inline      | Creates CapturedItem (CLARIFIED_AS_ACTION) + Action  |
| UC-03 | View Inbox                    | Returns all INBOX items                              |
| UC-04 | Clarify as Action             | INBOX item → CLARIFIED_AS_ACTION + new Action        |
| UC-05 | Clarify as Project            | INBOX item → CLARIFIED_AS_PROJECT + new Project      |
| UC-06 | Clarify as Reference          | INBOX item → REFERENCE                               |
| UC-07 | Clarify as Someday/Maybe      | INBOX item → SOMEDAY                                 |
| UC-08 | Move to Trash                 | INBOX item → TRASH                                   |
| UC-09 | View Actions (with filters)   | Filter by context, timeBucket, energyLevel, dueDate  |
| UC-10 | Assign Action to Project      | Set or clear project on action                       |
| UC-11 | Assign Action to Context      | Set or clear context on action                       |
| UC-12 | Complete an Action            | OPEN → COMPLETED                                     |
| UC-13 | Archive an Action             | COMPLETED → ARCHIVED                                 |
| UC-14 | View Project                  | Returns project + its actions                        |
| UC-15 | Rename Project                | Updates project name                                 |
| UC-16 | Complete a Project            | ACTIVE → COMPLETED; blocked if any action is OPEN    |
| UC-17 | Archive a Project             | COMPLETED → ARCHIVED                                 |
| UC-18 | Create a Context              | Creates context (active: true)                       |
| UC-19 | Rename a Context              | Updates context name                                 |
| UC-20 | Deactivate a Context          | active → false                                       |
| UC-21 | Activate a Context            | active → true                                        |
| UC-22 | Execute by Context            | Returns OPEN actions for an active context           |

---

## Architecture Rules

### Backend

1. **Domain layer is pure.** No TypeORM decorators, no Express, no DB imports. Domain entities have behavior methods that enforce invariants and throw typed domain errors.

2. **Application layer contains use cases.** Each use case is a class with a single `execute(input)` method. Use cases depend on repository interfaces (ports), not TypeORM directly.

3. **Infrastructure layer implements ports.** TypeORM entities live here (separate from domain entities). Repositories implement the interfaces defined in the application layer.

4. **Database swappability.** The TypeORM `DataSource` is configured in one file (`infrastructure/database/data-source.ts`). To swap SQLite for Postgres, only this file changes. Entities must not hard-code DB-specific features.

5. **API layer is thin.** Controllers parse HTTP, call use cases, and return responses. No business logic in routes.

6. **Error handling.** Domain errors are typed classes (e.g., `ItemAlreadyResolvedError`). The API layer maps them to HTTP status codes.

### Frontend

1. **Standalone components.** Use Angular standalone components throughout (no NgModules unless required by a third-party lib).

2. **Signals for state.** Use Angular signals and `computed` for reactive state. Avoid RxJS unless for HTTP (`HttpClient` observables, which can be converted with `toSignal`).

3. **Feature-based structure.** Each feature (inbox, actions, projects, contexts) is a self-contained folder with its own routes, components, and service.

4. **Services call the backend API.** Use `HttpClient` for all data fetching. No local state beyond the current session.

5. **Minimalist UI.** Plain, functional UI. No UI component library required — use native HTML elements and CSS. No animations unless explicitly asked.

---

## Implementation Instructions

When the user asks you to implement `$ARGUMENTS`:

1. **Read existing code first.** Use Glob and Read to understand what already exists before writing anything. Do not duplicate or overwrite existing work.

2. **Follow the layer boundaries.** Implement in order: domain → application → infrastructure → API → frontend. Do not skip layers.

3. **One responsibility per file.** Each use case in its own file. Each domain entity in its own file. Each component in its own folder.

4. **Use TypeScript strictly.** Enable `strict: true` in tsconfig. No `any` unless absolutely necessary. Use interfaces for repository ports.

5. **Keep it minimal.** Only implement what was asked. Do not add features, abstractions, or scaffolding beyond what is needed.

6. **Test at boundaries.** If tests are requested, unit test domain entities and use cases. Integration test the API routes.

7. **Reference the docs.** The canonical specs live in `docs/01-business/`. If uncertain about a business rule, read those files — do not invent rules.

---

## Common Patterns

### Repository Port (application layer)
```typescript
export interface ActionRepository {
  save(action: Action): Promise<void>;
  findById(id: string): Promise<Action | null>;
  findByFilters(filters: ActionFilters): Promise<Action[]>;
}
```

### Use Case
```typescript
export class CompleteActionUseCase {
  constructor(private readonly actions: ActionRepository) {}

  async execute(id: string): Promise<void> {
    const action = await this.actions.findById(id);
    if (!action) throw new ActionNotFoundError(id);
    action.complete();
    await this.actions.save(action);
  }
}
```

### TypeORM DataSource (infrastructure)
```typescript
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB_PATH ?? 'actio.sqlite',
  entities: [/* TypeORM entity classes */],
  synchronize: process.env.NODE_ENV !== 'production',
});
// To swap DB: change `type`, `database`, and add host/port/credentials as needed.
```

### Angular Signal-based Service
```typescript
@Injectable({ providedIn: 'root' })
export class InboxService {
  private http = inject(HttpClient);
  items = signal<CapturedItem[]>([]);

  loadInbox() {
    this.http.get<CapturedItem[]>('/api/inbox').subscribe(items => this.items.set(items));
  }
}
```
