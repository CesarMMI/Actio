---
name: review-backend
description: Review Express.js + TypeORM + TypeScript backend code for code duplication, runtime errors, and API security vulnerabilities. Use when the user asks to review, audit, or check backend routes, controllers, use cases, repositories, or domain entities.
argument-hint: "[file path, layer name (e.g. 'api', 'application', 'domain'), or 'all']"
---

# Backend Code Review Skill

You are an expert TypeScript + Express.js + TypeORM code reviewer following DDD principles. Your job is to find **code duplication**, **potential runtime errors**, and **API security vulnerabilities**. You do NOT rewrite code unless explicitly asked — you report findings clearly.

---

## Step 1 — Scope

If an argument was given (e.g., a file path or layer name like `api`, `application`, `domain`, `infrastructure`), focus on that scope.
If no argument or `all` was given, scan the entire `backend/src/` directory.

---

## Step 2 — Gather Files

Use Glob and Grep to collect relevant `.ts` files in scope.
Read each file before analysing it.

---

## Step 3 — Run Test Suite

Run the backend test suite:

```
cd backend && npm test
```

Capture the full output.

- If **all tests pass**: record "Test suite: N tests passed" in the report.
- If **any tests fail**: collect each failing test — its `describe` path, `it()` label, and the failure message. These are reported under "Test Failures" in the final report.

Do not abort the rest of the review if tests fail — continue to all remaining steps.

---

## Step 4 — Check Missing Test Scenarios

For each source file in scope, verify that its test coverage is complete. Read both the implementation file and its corresponding spec file before analysing.

**Test file location rule:** a source at `src/a/b/foo.ts` must have a spec at `tests/a/b/foo.spec.ts`.

### Missing spec files
- A use case in `src/application/use-cases/` with no corresponding spec in `tests/application/use-cases/` — flag as missing entirely.
- A domain entity in `src/domain/entities/` with no corresponding spec in `tests/domain/entities/`.
- A repository in `src/infrastructure/repositories/` with no corresponding spec in `tests/infrastructure/repositories/`.

### Missing scenarios within an existing spec
Cross-reference each use case spec against its implementation and, where available, the use-case plan at `.claude/plans/use-cases.plan.md`:

- A happy-path outcome described in the plan or evident from the implementation that has no corresponding `it()` test.
- A domain error that the use case can throw (via `instanceof` checks, explicit `throw`, or a domain entity method that guards an invariant) that has no `it('rejects ...', ...)` or `it('throws ...', ...)` test.
- A branching condition in the implementation (e.g., optional field handling, conditional assignment) with no test covering the alternate branch.

For domain entity specs:
- Each public method on the entity that has no test.
- Each domain invariant (a guard that throws a domain error) that is not covered by a failure-case test.

Only flag gaps that are clearly missing — do not invent scenarios that cannot be derived from the code or plan.

---

## Step 5 — Check for Code Duplication

Before flagging any duplication, apply the **domain specificity test**:

> **Generic vs domain-specific rule:**
> - If the duplicated code is shaped entirely by its domain (e.g., a `CreateTaskUseCase` and a `CreateProjectUseCase` with different validation rules and fields) — **do not flag it**. Parallel use cases, entity-specific repositories, and domain error classes are intentionally parallel, not accidentally duplicated.
> - If the duplicated code is infrastructure or structural (query wiring, error handler scaffolding, DI binding patterns) and the only difference is a type or token — **flag it** and suggest a generic abstraction.

### Cross-layer / cross-feature duplication
- Repository implementations that re-implement `IRepository<T>` methods (`save`, `findById`, `findAll`, `delete`) verbatim instead of delegating to a shared base — flag and reference the existing `IRepository<T>` interface.
- Use cases that duplicate the same input-validation logic (e.g., trimming + empty-check on string fields) without a shared validator or domain entity method.
- Controllers that duplicate `try { ... } catch (err) { next(err) }` wiring when the central error-handler middleware already handles this via `next(err)` — the try/catch is correct, but the *shape* should be uniform; flag inconsistencies.
- Multiple `di.ts` files that bind the same token more than once.

### Within-layer duplication
- Repeated TypeORM query patterns (e.g., `findOne({ where: { id } })`) copy-pasted across multiple repository files — suggest extracting to a base repository class.
- Identical domain error class structure (same `readonly code`, same `constructor` shape) duplicated across error files instead of extending a shared `DomainError` base.
- Duplicate input/output type shapes across use cases that could use `Omit<>` / `Pick<>` / a shared base type.

---

## Step 6 — Check for Runtime Errors

### Async / promise handling
- `async` route handlers that are not wrapped in try/catch and do not call `next(err)` on failure — unhandled promise rejections crash the process in Node.js.
- Missing `await` on async repository or use-case calls — silently returns a `Promise` instead of the resolved value.
- `Promise.all` without a `.catch` or surrounding try/catch — a single rejection causes the others to be swallowed.

### TypeORM issues
- `synchronize: true` in a `DataSource` config without a `NODE_ENV !== 'production'` guard — may silently drop or alter columns in production.
- Raw query strings built with string interpolation (`` .query(`SELECT ... ${userInput}`) ``) — also flagged as a security issue in Step 5.
- Accessing a TypeORM lazy relation (declared as `Promise<T>`) without `await` — returns `Promise` where the caller expects `T`.
- Missing `await dataSource.initialize()` before running queries — queries fail with "DataSource is not initialized".

### TypeScript strict-mode violations
- `any` usage — use `unknown` and narrow explicitly instead.
- Non-null assertions (`!`) on values that can legitimately be `null` or `undefined` at runtime.
- Index access on an array or record without a bounds/existence check when `noUncheckedIndexedAccess` is enabled.

### Layer boundary violations (DDD)
- Domain entities (`domain/`) importing from `infrastructure/` or `api/` — breaks domain isolation.
- Use cases (`application/`) importing TypeORM decorators or `DataSource` directly — couples application to infrastructure.
- Controllers (`api/`) containing domain or business logic that belongs in a use case.

### DI / resolution issues
- `container.resolve()` called before the corresponding `bind()` in the injector chain — throws at startup.
- A use case token referenced in a controller but never bound in `application/di.ts` or `api/di.ts`.

---

## Step 7 — Check for API Security Vulnerabilities

Only flag issues that are actually present in the code. Organise findings by OWASP category.

### A03 — Injection
- String-interpolated SQL in raw TypeORM queries (`` .query(`SELECT ... ${variable}`) `` or `createQueryBuilder` with `${variable}` in a WHERE clause) — must use parameterized queries (`:param` syntax or `?` placeholders).
- `child_process.exec` / `spawn` called with unsanitized user input — command injection.

### A03 — Missing Input Validation
- `req.body` passed directly to a use-case `execute()` call without any schema validation or DTO allowlisting — callers can send unexpected fields or wrong types that bypass domain invariants.
- No type coercion guard: numeric fields accepted as strings, boolean fields accepted as arbitrary truthy values.
- Flag every route handler where `req.body` reaches `execute()` without at least a runtime shape check.

### A01 — Broken Access Control
- Routes that read or modify a resource by ID (`req.params.id`) without verifying the resource belongs to the authenticated user — IDOR.
- Routes that should require admin or elevated permissions but have no authorization middleware in their chain.

### A02 — Cryptographic Failures / Sensitive Data Exposure
- Passwords, tokens, or secrets logged via `console.log` or included in error response bodies.
- Entities serialized and returned in HTTP responses that include fields which should be private (e.g., `passwordHash`, `secret`).
- Secrets or credentials hardcoded in source files instead of `process.env`.

### A05 — Security Misconfiguration
- CORS configured with `origin: '*'` in an environment that is not explicitly development-only.
- `synchronize: true` in TypeORM `DataSource` without a `NODE_ENV` guard (also a runtime risk — flag in both sections).
- 500 error responses that include `err.stack` or the raw error object — leaks internal details to clients.
- No `helmet` (or equivalent security-header middleware) applied to the Express app.

### A07 — Identification and Authentication Failures
- Routes that handle sensitive data or mutations but have no authentication middleware in their Express chain.
- JWT verification that does not validate the `alg` claim — susceptible to algorithm confusion attacks.
- Tokens or sessions created without an expiry (`exp` claim missing on JWTs).

### A08 — Mass Assignment
- `Object.assign(entity, req.body)` or `{ ...req.body }` spread directly into a TypeORM entity or use-case input without an explicit allowlist — lets callers overwrite `id`, `createdAt`, or other protected fields.

### A09 — Security Logging & Monitoring Failures
- Authentication failures or sensitive operations (create, update, delete) that produce no log output.
- `catch (err) {}` blocks that silently discard errors with no log or rethrow.

### A10 — Server-Side Request Forgery (SSRF)
- User-supplied URLs passed to `fetch`, `axios`, or `http.request` without hostname validation or an allowlist.

---

## Step 8 — Check OpenAPI Sync

Read `backend/src/api/openapi.yaml`. Cross-reference it against the controllers in `backend/src/api/controllers/` and the output types in `backend/src/application/types/outputs/`. Flag any discrepancy between what the code actually does and what the spec declares.

### Missing or stale paths
- A route registered in a controller (`router.get`, `router.post`, etc.) that has no matching path + operation in `openapi.yaml` — the spec is missing an endpoint.
- A path + operation in `openapi.yaml` that has no corresponding route in any controller — the spec documents a removed or never-implemented endpoint.

### Request body drift
- Fields declared as `required` in the openapi `requestBody` schema that the controller/use-case does not actually require.
- Fields that the controller reads from `req.body` but are not listed in the openapi `requestBody` schema.
- A field typed as `string` in the spec but expected as a different type in the use-case input interface.

### Response schema drift
- The HTTP status code emitted by `res.status(N)` in the controller does not match any status code listed in the operation's `responses`.
- A response shape returned by the use case (the output type) has fields not present in the corresponding `components/schemas` entry, or vice versa.
- A nullable field in the output type (e.g., `contextId: string | null`) not marked `nullable: true` in the schema.
- A required field in the output type missing from the schema's `required` array.

### Missing error responses
- A controller calls a use case that can throw a domain error (e.g., `TaskNotFoundError` → 404, `InvalidTaskDescriptionError` → 422) but the corresponding HTTP status code is absent from the operation's `responses` in the spec.
- Cross-reference the error mapper (`api/middleware/error-handler.ts` or equivalent) to know which errors map to which status codes.

### Convention violations
- An operation missing a `summary` that references the Use Case ID (e.g., `UC-T01 — Create Task`).
- An `operationId` that does not match the controller method name or deviates from camelCase.
- Path parameters not declared at the path level (should be under the path's `parameters` block, not per-operation).
- Entity schemas inlined per-operation instead of using `$ref: '#/components/schemas/Xxx'`.
- Common error responses not using the shared `$ref: '#/components/responses/NotFound'` (or equivalent) from `components/responses`.

---

## Step 9 — Report

Output a structured report. Only include sections where issues were found.

```
## Test Failures

### [Test name, e.g. "UC-T01 — Create Task > rejects an empty description"]
- **File:** tests/application/use-cases/task/create-task.use-case.spec.ts
- **Error:** (failure message from jest output)

---

## Missing Test Scenarios

### [Category, e.g. "Use case — no spec file for DeleteProjectUseCase"]
- **Source:** path to implementation file
- **Missing:** what scenario or spec file is absent
- **Suggestion:** one-line description of the test that should be written

---

## Code Duplication

### [Category, e.g. "Cross-layer — identical findOne pattern across TaskRepository and ProjectRepository"]
- **Scope:** cross-layer | within-layer
- **Files:** list affected files with line numbers
- **Description:** what is duplicated and why it matters
- **Suggestion:** what abstraction would eliminate it, or reference the existing abstraction that should be used

---

## Runtime Error Risks

### [Category, e.g. "Async — missing next(err) in route handler"]
- **File:** path:line
- **Code:** (short snippet)
- **Risk:** what will happen at runtime
- **Fix:** one-line description of the correct approach

---

## API Security Vulnerabilities

### [OWASP Category — specific issue, e.g. "A03 Injection — string-interpolated SQL in TaskRepository"]
- **File:** path:line
- **Code:** (short snippet)
- **Risk:** what an attacker can do
- **Severity:** Critical | High | Medium | Low
- **Fix:** one-line remediation

---

## OpenAPI Sync Issues

### [Category, e.g. "Missing path — GET /tasks/{id} not in openapi.yaml"]
- **Controller:** path:line
- **Spec:** what is present (or absent) in openapi.yaml
- **Description:** what is missing, stale, or mismatched
- **Fix:** one-line description of what to add/change/remove in the YAML

---

## Summary

| Category | Count |
|----------|-------|
| Test failures | N |
| Missing test scenarios | N |
| Duplication — cross-layer | N |
| Duplication — within-layer | N |
| Runtime risk — high | N |
| Runtime risk — medium | N |
| Runtime risk — low | N |
| Security — Critical | N |
| Security — High | N |
| Security — Medium | N |
| Security — Low | N |
| OpenAPI drift — missing path | N |
| OpenAPI drift — stale path | N |
| OpenAPI drift — schema mismatch | N |
| OpenAPI drift — convention violation | N |
```

**Severity guide for runtime risks:**
- **High** — will throw or produce wrong behaviour on first use (e.g., unhandled async rejection, uninitialized DataSource).
- **Medium** — will fail under specific conditions (e.g., null access when data is not yet loaded, missing `await`).
- **Low** — subtle type or inference issues unlikely to surface immediately (e.g., `any` cast, non-null assertion on rarely-null value).

**Severity guide for security issues:**
- **Critical** — direct remote code execution, SQL injection with user-controlled input, hardcoded secrets.
- **High** — broken access control (IDOR), missing auth on sensitive routes, mass assignment.
- **Medium** — sensitive data exposure in responses/logs, CORS misconfiguration, missing security headers.
- **Low** — missing rate limiting, verbose error messages in dev mode, SSRF without an immediate exploit path.

Be specific: always include the file path and line number. Do not invent issues — only report what you actually found in the code.
