---
name: ""
overview: ""
todos: []
isProject: false
---

### **Updated GTD Task Manager API Plan (TDD + Layered Implementation)**

Here’s how the previous plan is adjusted to match your feedback.

### **1. Development Approach: Strong TDD First**

- **Test-first workflow**:
  - For every feature or behavior, **write tests first**, then implement just enough code to make them pass.
  - Start from the **innermost/core business rules** (domain), then move outward (application → infrastructure → api).
- **Tests as business contracts**:
  - Tests are written to express **domain rules derived from the PRD** (e.g., clarify flows, valid/invalid status transitions, context-based views).
  - Once defined, tests **should rarely change**; they change only when business rules change, not when refactoring implementation.
- **Mock everything external**:
  - Domain tests: no Nest, no DB, no network.
  - Application tests: repositories and cross-layer services are mocked.
  - API tests: use cases mocked when unit-testing controllers; full stack exercised only in limited e2e tests.

---

### **2. Layer-by-Layer Implementation Order (with TDD per Layer)**

#### **2.1 Domain Layer (First)**

- **Step 1 — Domain test design & implementation**
  - Create domain unit tests in `tests/unit/domain/...` that cover:
    - Value objects (title, IDs, due date, time/energy buckets, etc.) with all edge cases.
    - Entities (`CapturedItem`, `Action`, `Project`, `Context`, `User`) invariants and state transitions.
    - Domain services/policies (e.g., clarify rules, project “next action” logic).
    - Domain errors (`EntityNotFoundError`, `InvalidStatusTransitionError`, etc.) and when they must be thrown.
  - These tests reflect **business rules from the PRD** and become the stable contract.
- **Step 2 — Domain implementation**
  - Implement value objects, entities, domain services, and domain error types to satisfy the tests.
  - Refactor freely as long as **all domain tests stay green** (they’re the spec).

#### **2.2 Application Layer (Second)**

- **Step 3 — Application use case tests**
  - Write unit tests in `tests/unit/application/...` for each use case (no Nest, pure TS + mocks):
    - `CaptureItemUseCase`, `ClarifyCapturedItemAsActionUseCase`, etc.
    - `ListActionsByContextUseCase`, `CompleteActionUseCase`, project and context management use cases.
  - Mock domain repositories and, if needed, domain services; verify:
    - Correct orchestration of domain calls.
    - Correct handling of domain errors.
    - Correct input/output shapes and edge cases (e.g., clarifying an already-clarified item).
- **Step 4 — Application implementation**
  - Implement each use case class (`execute` methods) and any application-level mappers until tests pass.
  - Keep tests stable; changes here are driven by business changes only.

#### **2.3 Infrastructure Layer (Third)**

- **Step 5 — Repository and mapping tests**
  - In `tests/unit/infrastructure/...`, write tests for:
    - Mapping between domain types and TypeORM entities (round-trip consistency).
    - Repository behaviors that translate domain operations into TypeORM queries (with a test DB or mocked TypeORM layer).
    - Edge cases in persistence (e.g., missing rows → `EntityNotFoundError` at domain/app boundary).
- **Step 6 — Infrastructure implementation**
  - Implement TypeORM entities, repository classes, and mappers to make infra tests pass.
  - Add migrations; verify schema behavior via tests where appropriate.
  - Keep infra tests focused on behavior, not internal ORM details, so infra can be refactored without rewriting tests.

#### **2.4 API Layer (Fourth)**

- **Step 7 — API unit tests**
  - In `tests/unit/api/...`, define tests for:
    - Controllers: DTO validation behavior, mapping HTTP → use case inputs, mapping outputs → HTTP responses.
    - Exception filters: mapping domain and application errors to **RFC 7807 problem+json** responses with human-friendly messages.
    - Guards and interceptors: auth enforcement, error formatting, basic logging if needed.
  - Mock use cases so tests focus strictly on HTTP contracts and error shapes.
- **Step 8 — API implementation**
  - Implement controllers, DTOs, validation pipes, JWT guards, and global RFC 7807 filter until all API tests pass.
  - Ensure controllers are thin and delegate to use cases.

---

### **3. E2E Tests (After Core Layers)**

- **Step 9 — Minimal e2e tests**
  - After domain, application, infra, and API layers are green in unit tests, add **thin e2e tests** in `tests/e2e/...`:
    - Happy-path flows: register → login → capture → clarify → execute.
    - Representative error flows: unauthorized access, invalid DTOs, domain errors mapped to `application/problem+json`.
  - These tests are higher-level and fewer in number; they validate wiring, not all edge cases (those belong to unit tests).

---

### **4. Test Stability & Change Policy**

- **When tests change**:
  - Only when **business rules or external contracts change** (e.g., new status, new clarify outcome, changed error semantics).
  - Refactors inside layers (e.g., performance optimizations, code cleanup, switching ORM) must be done **under the existing tests**.
- **Test focus per layer**:
  - Domain tests = core truth of business logic.
  - Application tests = orchestration and use-case boundaries.
  - Infra tests = correctness of persistence behavior and mapping.
  - API tests = HTTP contracts and RFC 7807 error semantics.
  - E2E tests = small set of full-path scenarios.

