---
name: ""
overview: ""
todos: []
isProject: false
---

### **Domain Layer – Concrete Test Cases (by Aggregate)**

- **CapturedItem**
  - **Creation**
    - Succeeds with valid title and optional notes/due date/preliminary project/context.
    - Trims title; rejects empty/whitespace-only or over-max-length titles.
  - **Status transitions**
    - New item is `INBOX` by default.
    - Can transition from `INBOX` → `CLARIFIED_AS_ACTION` / `CLARIFIED_AS_PROJECT` / `REFERENCE` / `SOMEDAY` / `TRASH`.
    - Rejects re-clarifying an already-clarified item (throws `BusinessRuleViolationError`).
  - **Clarification invariants**
    - Clarifying as Action yields one or more `Action` domain objects linked back to the `CapturedItem` (if you choose to model the linkage).
    - Clarifying as Project yields `Project` plus at least one Action when requested.
- **Action**
  - **Creation**
    - Requires non-empty, length-bounded title; optional notes, due date, time bucket, energy, project, context.
    - Defaults status to `OPEN`; created timestamp is set.
  - **Status transitions**
    - Allows `OPEN` → `COMPLETED`; allows `COMPLETED` → `ARCHIVED` (if supported).
    - Rejects invalid transitions (e.g., `ARCHIVED` → `OPEN`, `COMPLETED` → `OPEN`).
  - **Associations**
    - At most one `ProjectId` and one `ContextId`.
    - Updating project/context preserves other fields and invariants.
- **Project**
  - **Creation**
    - Requires name with length constraints; optional description.
    - Default status `ACTIVE`.
  - **Status transitions**
    - `ACTIVE` → `COMPLETED` allowed only when all associated actions are completed (or no actions).
    - `ACTIVE`/`COMPLETED` → `ARCHIVED` allowed; invalid transitions rejected.
  - **“Next action” logic**
    - `hasNextAction()` returns true when at least one associated Action is `OPEN`.
    - Returns false when all are completed/archived or there are no actions.
- **Context**
  - **Creation**
    - Requires valid name, unique per user; optional description.
  - **Activation**
    - `active` flag default true; can be toggled; deactivated contexts still preserve attached actions but should be treated as inactive by higher layers.
- **User**
  - **Creation & security**
    - Requires valid email and hashed password; prohibits plain password storage.
    - Enforces email format and uniqueness (logic will be checked at app/infra level).
- **Domain Services**
  - **ClarifyItemService**
    - Clarifying to Action:
      - Creates Action(s) reflecting captured item’s title/notes and optional project/context/due date.
      - Marks item as clarified; throws `BusinessRuleViolationError` if item not in `INBOX`.
    - Clarifying to Project:
      - Creates Project named from item’s title; optional initial actions seeded correctly.
      - Marks item as clarified; rejects second clarification.
    - Clarifying to Reference/Someday/Trash:
      - Moves item to correct terminal state; ensures item is removed from “actionable” category.
  - **Other policies**
    - `ensureProjectHasNextAction(project, actions)` signals when project has no next action (used by application layer).
- **Domain Errors**
  - Each error (`EntityNotFoundError`, `InvalidStatusTransitionError`, `BusinessRuleViolationError`) correctly carries a safe, human-readable message and metadata (entity type/id, previous/new status, etc.).

---

### **Application Layer – Test Cases by Use Case**

- **CaptureItemUseCase**
  - Creates new `CapturedItem` with minimal input (title only).
  - Rejects invalid titles (delegates to domain VO, surfaces domain error).
  - Persists item via `CapturedItemRepository.save`.
  - Ensures returned result matches expected output DTO (id, title, createdAt, initial status).
- **ClarifyCapturedItemAsActionUseCase**
  - Happy path: item in `INBOX` is converted into one (or more) Actions, item status updated; repositories called in right order.
  - Rejects:
    - Non-existent ID (`EntityNotFoundError`).
    - Already-clarified item (domain/business-rule error).
  - Ensures created Actions are linked to provided project/context if given.
- **ClarifyCapturedItemAsProjectUseCase**
  - Happy path: captured item becomes Project plus optional initial Actions.
  - Handles explicit project name override (if API allows).
  - Rejects clarify on non-INBOX or missing item.
- **ClarifyCapturedItemAsReferenceUseCase / AsSomedayUseCase / TrashCapturedItemUseCase**
  - Mark item as appropriate final state; ensure it will not be returned by inbox/action queries.
  - Reject re-clarification.
- **CreateProjectUseCase**
  - Creates a new Project with valid name; optional description.
  - Rejects invalid name or name collisions if you enforce uniqueness per user.
  - Returns DTO including initial metadata (status, counts).
- **RenameProjectUseCase / ArchiveProjectUseCase**
  - Renaming: updates name; rejects empty/too-long names.
  - Archiving: ensures associated actions remain consistent; status transitions must respect domain rules.
- **AssignActionToProjectUseCase / AssignActionToContextUseCase**
  - Happy path: sets project/context IDs for an `Action`.
  - Rejects:
    - Action not found or belongs to another user.
    - Target project/context not found or inactive (for contexts, if you enforce that).
  - Ensures that domain invariants (only one project/context) hold.
- **ListProjectsUseCase / GetProjectDetailUseCase**
  - Projects list:
    - Returns only user’s projects.
    - Each project summary includes correct count of open actions.
  - Project detail:
    - Returns project plus lists of open vs completed actions correctly partitioned.
- **ListActionsByContextUseCase**
  - With context id, returns only `OPEN` actions for that context and current user.
  - Applies filters: time bucket, energy level, due date ranges; verify combinations.
  - Orders by due date with overdue first, then upcoming.
- **CompleteActionUseCase**
  - Happy path: marks `OPEN` action as `COMPLETED`, sets completion timestamp.
  - Rejects:
    - Action already completed/archived (invalid transition).
    - Action not found / belongs to different user.
- **RegisterUserUseCase**
  - Creates user with unique email and hashed password; does not log or return password.
  - Rejects duplicate email / invalid email format.
- **LoginUseCase**
  - Given valid credentials, returns JWT/access token; invalid credentials cause auth failure.
  - Optional: handles locked/inactive accounts.
- **UpdateProfileUseCase**
  - Updates display name, time zone, default context; validates values.

---

### **Infrastructure Layer – Test Cases**

- **TypeORM Mapping Tests**
  - For each aggregate:
    - Domain → ORM → Domain round-trip preserves all fields (except expected differences like timestamps generated by DB).
    - Value object conversions (e.g., `Title` ↔ `varchar`, `DueDate` ↔ nullable timestamp) behave as expected, including nulls.
- **Repository Implementations**
  - `CapturedItemRepository`:
    - `save` persists and returns updated domain object.
    - `findInboxByUser(userId, pagination)` returns only `INBOX` items for that user, exclusion of clarified/trashed ones.
    - `findById` throws or returns `null` consistently; mapping to `EntityNotFoundError` in application layer tests.
  - `ActionRepository`:
    - `findByContext(userId, contextId, filters)` issues correct TypeORM query (verify by mocking or in test DB).
    - `save`, `findById`, `findByProject` behave as spec’d.
  - `ProjectRepository`:
    - `findAllByUser` returns only user’s projects.
    - Supports queries for “projects without next action” if you add that optimization.
  - `ContextRepository`, `UserRepository`:
    - CRUD behaviors; uniqueness constraints for names/emails tested via DB errors mapped appropriately.
- **Config & DB Setup**
  - Config factory builds TypeORM options from `.env` correctly in test environment.
  - Migrations:
    - Initial migration creates required tables; integration tests confirm expected columns/constraints.

---

### **API Layer – Test Cases**

- **Controllers (unit, with mocked use cases)**
  - **Captured Items**
    - `POST /captured-items`:
      - Valid payload yields 201 with correct response shape.
      - Missing/invalid title yields 400 with RFC 7807 body (`type`, `title`, `status`, `detail`, `errors`).
    - `GET /captured-items/inbox`:
      - Returns user's inbox items only.
  - **Clarify endpoints**
    - `POST /captured-items/:id/clarify/as-action`:
      - Valid request calls `ClarifyCapturedItemAsActionUseCase.execute` with correct input.
      - Domain/business errors (e.g., already clarified) converted to `409` or `400` `application/problem+json`.
  - **Actions**
    - `GET /contexts/:contextId/actions`:
      - Applies query DTO validation (time, energy, due date filters).
      - Maps use case output into response list.
    - `POST /actions/:id/complete`:
      - Completed action returns 200; invalid transitions/ownership produce correct RFC 7807 error.
  - **Projects & Contexts**
    - CRUD endpoints validate DTOs and call appropriate use cases; path/param validation (UUID etc.) returns 400 on invalid IDs.
- **Authentication / Guards**
  - Requests without JWT to protected endpoints yield 401 with problem+json body.
  - Requests with invalid/expired JWT yield 401; with valid JWT but accessing another user’s resource yield 404 or 403 depending on your policy.
- **RFC 7807 Exception Filter**
  - Maps:
    - `HttpException` to problem+json with corresponding status and standard fields.
    - Domain errors (e.g., `EntityNotFoundError`) to 404 problem+json.
    - Validation errors to 400 problem+json with an `errors` extension listing field issues.
    - Unhandled errors to 500 problem+json with generic human-friendly `detail`.

---

### **E2E Layer – Minimal Scenario List**

- **Auth & Basic Flow**
  - Register + login; obtain token; access a protected endpoint successfully.
- **Capture → Clarify → Execute**
  - With a valid token:
    - `POST /captured-items` → `GET /captured-items/inbox` shows new item.
    - Clarify captured item as Action; item disappears from inbox, appears in context view.
    - Complete action; context view no longer lists it; an action history endpoint (if present) shows it as completed.
- **Error Cases**
  - Access protected endpoint without token → 401 problem+json.
  - Invalid DTO (e.g., wrong enum) → 400 problem+json.
  - Clarify non-existent item ID → 404 problem+json.

---

### **Implementation Checklist (High-Level, in TDD Order)**

- **Domain**
  - Set up `tests/unit/domain/...` structure.
  - Write tests for all VOs, entities, services, and domain errors listed above.
  - Implement domain code until green.
- **Application**
  - Set up `tests/unit/application/...`.
  - Write tests for each use case (capture, clarify variants, project/context, execute, auth).
  - Implement use cases and interfaces until green.
- **Infrastructure**
  - Set up `tests/unit/infrastructure/...`.
  - Write mapping and repository behavior tests.
  - Implement TypeORM entities, mappers, repos, config, migrations until green.
- **API**
  - Set up `tests/unit/api/...`.
  - Write controller, DTO, guard, and exception-filter tests.
  - Implement modules, controllers, DTOs, guards, RFC 7807 filter until green.
- **E2E**
  - Set up `tests/e2e/...` with Nest testing module and test env.
  - Implement the small set of end-to-end scenarios.

