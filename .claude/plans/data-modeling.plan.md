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
| `contextId`    | Identifier | No       | Yes     | FK → Context. Situational tag for the task                |
| `projectId`    | Identifier | No       | Yes     | FK → Project. Goal grouping for the task                  |
| `parentTaskId` | Identifier | No       | Yes     | FK → Task (self). The task that owns this one as a child  |
| `childTaskId`  | Identifier | No       | Yes     | FK → Task (self). The single child task of this task      |
| `createdAt`    | Timestamp  | Yes      | No      | Set once at creation                                      |
| `updatedAt`    | Timestamp  | Yes      | Auto    | Updated automatically on every successful mutation        |

**Constraints:**
- `description` must be a non-empty, non-whitespace string at all times.
- `contextId`, if set, must reference an existing Context.
- `projectId`, if set, must reference an existing Project.
- `parentTaskId` and `childTaskId` cannot reference the task's own `id`.
- A task may have at most one child (`childTaskId` is a single reference, not a list).
- A task may have at most one parent (`parentTaskId` is unique — a task cannot be the child of two tasks simultaneously).
- No circular references are allowed in the parent-child chain (cycles are rejected).

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

### Task ↔ Task (self-referential, one-to-one chain, optional)

```
Task 0..1 ──── 0..1 Task (child)
```

- A Task may have zero or one child Task (`childTaskId`).
- A Task may have zero or one parent Task (`parentTaskId`).
- This forms a **singly-linked chain**, not a tree with multiple branches.
- The relationship is bidirectional: setting a child updates both sides (`childTaskId` on parent, `parentTaskId` on child).

**Cascade behavior on deletion:**
- When a Task with a **child** is deleted: the child's `parentTaskId` is cleared. The child remains in the system as a standalone task.
- When a Task with a **parent** is deleted: the parent's `childTaskId` is cleared. The parent remains in the system.
- Both cascades apply simultaneously if the deleted task has both a parent and a child (it is a middle node in a chain).

---

## Entity Relationship Diagram (textual)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Context   │       │    Task     │       │   Project   │
│─────────────│       │─────────────│       │─────────────│
│ id          │◄──────│ contextId   │       │ id          │
│ title       │ 0..1  │ description │  0..1 │ title       │
│ createdAt   │       │ projectId   │──────►│ createdAt   │
│ updatedAt   │       │ parentTaskId│       │ updatedAt   │
└─────────────┘       │ childTaskId │       └─────────────┘
                      │ createdAt   │◄──┐
                      │ updatedAt   │   │ self (0..1)
                      └─────────────┘───┘
```

---

## Business Rules Summary

| Rule   | Entity  | Description                                                              |
|--------|---------|--------------------------------------------------------------------------|
| BR-001 | Task    | `description` is required and non-empty on creation                      |
| BR-002 | Task    | `description` cannot be cleared or set to whitespace on update           |
| BR-003 | Task    | `contextId`, if provided, must reference an existing Context             |
| BR-004 | Task    | `projectId`, if provided, must reference an existing Project             |
| BR-005 | Task    | A Task may have at most one child at any time                            |
| BR-006 | Task    | A Task may have at most one parent at any time                           |
| BR-007 | Task    | A Task cannot reference itself as parent or child                        |
| BR-008 | Task    | Circular parent-child chains are forbidden                               |
| BR-009 | Task    | Deleting a Task with a child orphans the child (clears its `parentTaskId`) |
| BR-010 | Task    | Deleting a Task with a parent clears the parent's `childTaskId`          |
| BR-011 | Task    | Context and Project associations are independent of each other           |
| BR-012 | Task    | `contextId` and `projectId` can be explicitly cleared without side effects |
| BR-013 | Context | `title` is required and non-empty on creation                            |
| BR-014 | Context | `title` cannot be cleared or set to whitespace on update                 |
| BR-015 | Context | `title` must be unique (case-insensitive) across all Contexts            |
| BR-016 | Context | A Context referenced by any Task cannot be deleted                       |
| BR-017 | Project | `title` is required and non-empty on creation                            |
| BR-018 | Project | `title` cannot be cleared or set to whitespace on update                 |
| BR-019 | Project | `title` must be unique (case-insensitive) across all Projects            |
| BR-020 | Project | A Project referenced by any Task cannot be deleted                       |
| BR-021 | All     | `id` is immutable after creation                                         |
| BR-022 | All     | `createdAt` is immutable after creation                                  |
| BR-023 | All     | `updatedAt` is set automatically; cannot be set manually                 |
