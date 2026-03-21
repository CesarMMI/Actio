# PRD — Actio Task Management System

## 1. Overview

**Actio** is a personal task management system built around two organizational axes: **Projects** (goal-based grouping) and **Contexts** (situational tagging). Instead of a flat to-do list, Actio lets users structure work the way they think about it — by outcome and by circumstance.

**Problem it solves:** Flat task lists create noise. People waste time deciding what to do next because they lack a structured way to filter tasks by what they're working toward or what conditions they're currently in. Actio solves this by making context and project first-class concepts, not just labels.

**Core value proposition:** A minimal, expressive task model that reduces decision overhead and improves focus without the complexity of full project management tools.

---

## 2. Version Roadmap

### v1 — Core Domain (current)

The foundation. Establishes the data model and business rules for the three core entities: **Tasks**, **Contexts**, and **Projects**. This version is intentionally narrow — it covers only the essential domain logic needed to represent and manage work items.

**What v1 delivers:**
- Full CRUD for Tasks, Contexts, and Projects
- Optional association of a Task to a Context and/or a Project
- Task completion: a Task can be marked as done and reopened
- Enforcement of all core business rules (validation, referential integrity)
- Paginated, filtered, and sorted task listing

**What v1 explicitly excludes:**
- Authentication and authorization
- User accounts and multi-tenancy
- Due dates, scheduling, or reminders
- Task prioritization or ordering
- Recurring tasks
- Attachments or comments
- Audit logs and activity history
- Infrastructure, persistence engine, or deployment concerns

> See [`data-modeling.md`](./data-modeling.md) for entity definitions and [`use-cases.md`](./use-cases.md) for detailed use case specifications.

---

### v2 — Task Lifecycle (planned)

Extends task completion into a richer **status lifecycle** (e.g., inbox, active, done, dropped) supporting the full GTD-style workflow.

**Anticipated additions:**
- Expanded status field with defined valid transitions (beyond binary done/not-done)
- Status-based filtering
- Bulk status updates (e.g., complete all tasks in a project)

---

### v3 — Scheduling & Time (planned)

Adds time awareness to tasks without imposing deadlines as a hard requirement.

**Anticipated additions:**
- Optional due date per Task
- Optional scheduled date (when to work on it, not when it's due)
- Overdue detection rule
- Calendar-style views (presentation layer concern)

---

### v4 — Collaboration (planned)

Expands the system to support multiple users sharing projects and contexts.

**Anticipated additions:**
- User accounts and authentication
- Project membership and permissions
- Shared Contexts within a workspace
- Activity history and audit trail

---

## 3. Design Principles

- **Minimal by default.** Every field and rule must earn its place. No speculative complexity.
- **Explicit over implicit.** Business rules are stated atomically and unambiguously. Edge cases are not left to interpretation.
- **Domain-first.** The model is defined independently of any technology, persistence layer, or UI framework.
- **Additive versioning.** Each version builds on the previous without breaking the core model.
