# Actio — System Use Cases

## Context

This document defines the abstract use cases for Actio V1. It is derived from the PRD and entities spec. It covers every user-facing operation, the preconditions that must hold, and the outcomes produced. No implementation details are included.

---

## Actor

**User** — the single actor in V1. No authentication, no roles.

---

## Use Case Groups

1. Capture
2. Inbox Processing (Clarify)
3. Actions
4. Projects
5. Contexts

---

## 1. Capture

### UC-01 — Quick Capture

**Summary:** User saves an idea or obligation to the Inbox immediately, with no decisions required.

**Preconditions:** None.

**Inputs:** Title (required), Notes (optional).

**Outputs:**
- A CapturedItem is created with status `INBOX`.
- The item appears in the Inbox.

---

### UC-02 — Capture and Resolve Inline

**Summary:** User captures an item and immediately converts it into an Action in a single operation, bypassing the Inbox.

**Preconditions:** None.

**Inputs:** Title (required), Notes (optional), Project (optional), Context (optional), Due date (optional), Time bucket (optional), Energy level (optional).

**Outputs:**
- A CapturedItem is created with status `CLARIFIED_AS_ACTION`.
- An Action is created with the provided metadata.
- The item does **not** appear in the Inbox.

---

## 2. Inbox Processing (Clarify)

All clarification use cases share the same precondition:

> **Precondition:** The CapturedItem must have status `INBOX`. A previously resolved item cannot be resolved again.

### UC-03 — View Inbox

**Summary:** User sees all items awaiting a decision.

**Preconditions:** None.

**Inputs:** None.

**Outputs:** A list of all CapturedItems with status `INBOX`.

---

### UC-04 — Clarify as Action

**Summary:** User decides an inbox item is a concrete step and converts it into an Action.

**Inputs:** CapturedItem reference. Optionally: Project, Context, Due date, Time bucket, Energy level.

**Outputs:**
- CapturedItem status changes to `CLARIFIED_AS_ACTION`.
- A new Action is created, inheriting the item's title and notes, with any supplied metadata.
- Item is removed from the Inbox view.

---

### UC-05 — Clarify as Project

**Summary:** User decides an inbox item represents a multi-step goal and promotes it to a Project.

**Inputs:** CapturedItem reference. Optionally: Description.

**Outputs:**
- CapturedItem status changes to `CLARIFIED_AS_PROJECT`.
- A new Project is created with the item's title and optional description.
- Item is removed from the Inbox view.

---

### UC-06 — Clarify as Reference

**Summary:** User decides the item is useful information that requires no action.

**Inputs:** CapturedItem reference.

**Outputs:**
- CapturedItem status changes to `REFERENCE`.
- Item is removed from the Inbox view.

---

### UC-07 — Clarify as Someday/Maybe

**Summary:** User defers the item — not now, but don't discard it.

**Inputs:** CapturedItem reference.

**Outputs:**
- CapturedItem status changes to `SOMEDAY`.
- Item is removed from the Inbox view.

---

### UC-08 — Move to Trash

**Summary:** User discards an inbox item.

**Inputs:** CapturedItem reference.

**Outputs:**
- CapturedItem status changes to `TRASH`.
- Item is removed from the Inbox view.

---

## 3. Actions

### UC-09 — View Actions (with filters)

**Summary:** User lists actions, optionally narrowed by one or more criteria.

**Inputs (all optional):** Context, Time bucket (`short | medium | long`), Energy level (`low | medium | high`), Due date range.

**Outputs:** A filtered list of Actions matching all supplied criteria.

---

### UC-10 — Assign Action to Project

**Summary:** User associates an action with a project, or clears an existing association.

**Preconditions:** Action exists.

**Inputs:** Action reference, Project reference (or null to clear).

**Outputs:** Action's project association is updated.

---

### UC-11 — Assign Action to Context

**Summary:** User associates an action with a context, or clears an existing association.

**Preconditions:** Action exists.

**Inputs:** Action reference, Context reference (or null to clear).

**Outputs:** Action's context association is updated.

---

### UC-12 — Complete an Action

**Summary:** User marks an open action as done.

**Preconditions:** Action status is `OPEN`.

**Inputs:** Action reference.

**Outputs:**
- Action status changes to `COMPLETED`.
- If the action belongs to a project, the project may now be eligible for completion (see UC-16).

---

### UC-13 — Archive an Action

**Summary:** User archives a completed action to remove it from active views.

**Preconditions:** Action status is `COMPLETED`.

**Inputs:** Action reference.

**Outputs:** Action status changes to `ARCHIVED`. Action no longer appears in active action lists.

---

## 4. Projects

### UC-14 — View Project

**Summary:** User opens a project to see all its associated actions.

**Inputs:** Project reference.

**Outputs:** Project details and a list of all Actions belonging to that project.

---

### UC-15 — Rename Project

**Summary:** User changes the name of a project.

**Preconditions:** Project exists.

**Inputs:** Project reference, new name (required).

**Outputs:** Project name is updated.

---

### UC-16 — Complete a Project

**Summary:** User marks a project as done.

**Preconditions:** Project status is `ACTIVE`. All associated Actions must be `COMPLETED` or `ARCHIVED` — no `OPEN` actions may remain.

**Inputs:** Project reference.

**Outputs:**
- Project status changes to `COMPLETED`.
- If any associated action is still `OPEN`, the operation is rejected and the user is informed of the blocker.

---

### UC-17 — Archive a Project

**Summary:** User archives a completed project.

**Preconditions:** Project status is `COMPLETED`.

**Inputs:** Project reference.

**Outputs:** Project status changes to `ARCHIVED`. Project no longer appears in active project views.

---

## 5. Contexts

### UC-18 — Create a Context

**Summary:** User defines a new context (e.g. @computer, @errands).

**Inputs:** Name (required), Description (optional).

**Outputs:** A new Context is created in active state.

---

### UC-19 — Rename a Context

**Summary:** User updates a context's name.

**Preconditions:** Context exists.

**Inputs:** Context reference, new name (required).

**Outputs:** Context name is updated across all associated actions.

---

### UC-20 — Deactivate a Context

**Summary:** User temporarily disables a context so its actions are excluded from the active list.

**Preconditions:** Context is currently active.

**Inputs:** Context reference.

**Outputs:** Context `active` flag set to `false`. Actions in this context are hidden from the default action list.

---

### UC-21 — Activate a Context

**Summary:** User re-enables a previously deactivated context.

**Preconditions:** Context is currently inactive.

**Inputs:** Context reference.

**Outputs:** Context `active` flag set to `true`. Associated actions reappear in the action list.

---

### UC-22 — Execute by Context

**Summary:** User focuses on one context to see and complete only what is actionable right now.

**Preconditions:** Context is active.

**Inputs:** Context reference.

**Outputs:** A list of all `OPEN` Actions assigned to that context. User can then mark them complete (UC-12).

---

## State Transition Summary

### CapturedItem
```
INBOX → CLARIFIED_AS_ACTION  (UC-04, UC-02)
INBOX → CLARIFIED_AS_PROJECT (UC-05)
INBOX → REFERENCE            (UC-06)
INBOX → SOMEDAY              (UC-07)
INBOX → TRASH                (UC-08)
[all terminal — no further transitions]
```

### Action
```
OPEN → COMPLETED     (UC-12)
COMPLETED → ARCHIVED (UC-13)
```

### Project
```
ACTIVE → COMPLETED   (UC-16, requires all actions COMPLETED | ARCHIVED)
COMPLETED → ARCHIVED (UC-17)
```
