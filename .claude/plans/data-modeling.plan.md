# Data Modeling — Actio v1

This document defines every entity in the Actio system, their attributes, constraints, and relationships.

---

## Entities

### Task

The central entity. Represents a discrete unit of work.

| Attribute      | Type       | Required | Mutable | Description                                               |
|----------------|------------|----------|---------|-----------------------------------------------------------|
| `id`           | Identifier | Yes      | No      | Unique, system-generated at creation                      |
| `description`  | Text       | Yes      | Yes     | Human-readable description of the work; cannot be empty  |
| `done`         | Boolean    | Yes      | Yes     | Whether the task has been completed; defaults to `false`  |
| `doneAt`       | Timestamp  | No       | Yes     | Set when the task is completed; cleared when reopened     |
| `contextId`    | Identifier | No       | Yes     | FK → Context. Situational tag for the task                |
| `projectId`    | Identifier | No       | Yes     | FK → Project. Goal grouping for the task                  |
| `createdAt`    | Timestamp  | Yes      | No      | Set once at creation                                      |
| `updatedAt`    | Timestamp  | Yes      | Auto    | Updated automatically on every successful mutation        |

**Constraints:**
- `description` must be a non-empty, non-whitespace string at all times.
- `done` defaults to `false` on creation and can be toggled freely at any time.
- `doneAt` is `null` on creation. It is set to the current timestamp when the task is completed and cleared to `null` when the task is reopened. It must always be consistent with `done` (`done: true` ↔ `doneAt` is set).
- `contextId`, if set, must reference an existing Context.
- `projectId`, if set, must reference an existing Project.

---

### Context

Represents a situational condition under which tasks are actionable. Examples: "at home", "with laptop", "low energy", "waiting for".

| Attribute   | Type       | Required | Mutable | Description                                              |
|-------------|------------|----------|---------|----------------------------------------------------------|
| `id`        | Identifier | Yes      | No      | Unique, system-generated at creation                     |
| `title`     | Text       | Yes      | Yes     | Name of the context; must be unique (case-insensitive)   |
| `createdAt` | Timestamp  | Yes      | No      | Set once at creation                                     |
| `updatedAt` | Timestamp  | Yes      | Auto    | Updated automatically on every successful mutation       |

**Constraints:**
- `title` must be a non-empty, non-whitespace string at all times.
- `title` must be unique across all Contexts (case-insensitive). Duplicates are rejected on create and on rename.
- A Context cannot be deleted while it is referenced by one or more Tasks.

---

### Project

Represents a goal or initiative that groups related tasks toward a desired outcome.

| Attribute   | Type       | Required | Mutable | Description                                              |
|-------------|------------|----------|---------|----------------------------------------------------------|
| `id`        | Identifier | Yes      | No      | Unique, system-generated at creation                     |
| `title`     | Text       | Yes      | Yes     | Name of the project; must be unique (case-insensitive)   |
| `createdAt` | Timestamp  | Yes      | No      | Set once at creation                                     |
| `updatedAt` | Timestamp  | Yes      | Auto    | Updated automatically on every successful mutation       |

**Constraints:**
- `title` must be a non-empty, non-whitespace string at all times.
- `title` must be unique across all Projects (case-insensitive). Duplicates are rejected on create and on rename.
- A Project cannot be deleted while it is referenced by one or more Tasks.

---

## Relationships

### Task ↔ Context (many-to-one, optional)

```
Task 0..* ──── 0..1 Context
```

- A Task may be associated with zero or one Context.
- A Context may be associated with zero or many Tasks.
- The association is set via `Task.contextId`.
- The association is optional and can be cleared at any time without affecting the Context.
- If a Context is deleted, all tasks must have already removed the reference (enforced by deletion guard).

---

### Task ↔ Project (many-to-one, optional)

```
Task 0..* ──── 0..1 Project
```

- A Task may be associated with zero or one Project.
- A Project may be associated with zero or many Tasks.
- The association is set via `Task.projectId`.
- The association is optional and can be cleared at any time without affecting the Project.
- If a Project is deleted, all tasks must have already removed the reference (enforced by deletion guard).

---

## Entity Relationship Diagram (textual)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Context   │       │    Task     │       │   Project   │
│─────────────│       │─────────────│       │─────────────│
│ id          │◄──────│ contextId   │       │ id          │
│ title       │ 0..1  │ description │  0..1 │ title       │
│ createdAt   │       │ done        │──────►│ createdAt   │
│ updatedAt   │       │ doneAt      │       │ updatedAt   │
└─────────────┘       │ projectId   │       └─────────────┘
                      │ createdAt   │
                      │ updatedAt   │
                      └─────────────┘
```

---

## Business Rules Summary

| Rule   | Entity  | Description                                                              |
|--------|---------|--------------------------------------------------------------------------|
| BR-001 | Task    | `description` is required and non-empty on creation                      |
| BR-002 | Task    | `description` cannot be cleared or set to whitespace on update           |
| BR-002b| Task    | `done` defaults to `false` on creation; can be set to `true` or `false` at any time |
| BR-002c| Task    | `doneAt` is set to the current timestamp when `done` becomes `true`; cleared to `null` when `done` becomes `false` |
| BR-003 | Task    | `contextId`, if provided, must reference an existing Context             |
| BR-004 | Task    | `projectId`, if provided, must reference an existing Project             |
| BR-005 | Task    | Context and Project associations are independent of each other           |
| BR-006 | Task    | `contextId` and `projectId` can be explicitly cleared without side effects |
| BR-007 | Context | `title` is required and non-empty on creation                            |
| BR-008 | Context | `title` cannot be cleared or set to whitespace on update                 |
| BR-009 | Context | `title` must be unique (case-insensitive) across all Contexts            |
| BR-010 | Context | A Context referenced by any Task cannot be deleted                       |
| BR-011 | Project | `title` is required and non-empty on creation                            |
| BR-012 | Project | `title` cannot be cleared or set to whitespace on update                 |
| BR-013 | Project | `title` must be unique (case-insensitive) across all Projects            |
| BR-014 | Project | A Project referenced by any Task cannot be deleted                       |
| BR-015 | All     | `id` is immutable after creation                                         |
| BR-016 | All     | `createdAt` is immutable after creation                                  |
| BR-017 | All     | `updatedAt` is set automatically; cannot be set manually                 |
