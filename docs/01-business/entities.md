# V1 Entities

## 1. CapturedItem

**Properties**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | text | yes | |
| notes | text | no | |
| status | CapturedItemStatus | yes | default: INBOX |

**Status values**
`INBOX`, `CLARIFIED_AS_ACTION`, `CLARIFIED_AS_PROJECT`, `REFERENCE`, `SOMEDAY`, `TRASH`

**Behaviors**
- `clarifyAsAction` — resolves the item as an Action; only allowed when status is INBOX
- `clarifyAsProject` — resolves the item as a Project; only allowed when status is INBOX
- `clarifyAsReference` — marks the item as reference material; only allowed when status is INBOX
- `clarifyAsSomeday` — defers the item as someday/maybe; only allowed when status is INBOX
- `moveToTrash` — discards the item; only allowed when status is INBOX

**Rules**
- Once resolved, a captured item cannot be resolved again

**Relations**
- Standalone — not directly related to other entities

---

## 2. Action

**Properties**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | text | yes | |
| notes | text | no | |
| due date | date | no | |
| time bucket | TimeBucket | no | |
| energy level | EnergyLevel | no | |
| project | Project reference | no | at most one |
| context | Context reference | no | at most one |
| status | ActionStatus | yes | default: OPEN |

**Status values**
`OPEN`, `COMPLETED`, `ARCHIVED`

**Behaviors**
- `assignProject` — associates or clears the action's project
- `assignContext` — associates or clears the action's context
- `complete` — marks the action as completed; only allowed when status is OPEN
- `archive` — archives the action; only allowed when status is COMPLETED

**Rules**
- An action can belong to at most one project
- An action can belong to at most one context

**Relations**
- Belongs to one **Project** (optional)
- Belongs to one **Context** (optional)

---

## 3. Project

**Properties**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | text | yes | mutable |
| description | text | no | |
| status | ProjectStatus | yes | default: ACTIVE |

**Status values**
`ACTIVE`, `COMPLETED`, `ARCHIVED`

**Behaviors**
- `rename` — updates the project's name
- `complete` — marks the project as completed; only allowed when all associated actions are COMPLETED or ARCHIVED
- `archive` — archives the project; only allowed when status is COMPLETED

**Rules**
- A project cannot be completed while it has open actions

**Relations**
- Has many **Actions**

---

## 4. Context

**Properties**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | text | yes | mutable |
| description | text | no | |
| active | boolean | yes | default: true |

**Behaviors**
- `rename` — updates the context's name
- `activate` — marks the context as active
- `deactivate` — marks the context as inactive

**Relations**
- Has many **Actions**

---

## 5. Enums

**CapturedItemStatus**
`INBOX | CLARIFIED_AS_ACTION | CLARIFIED_AS_PROJECT | REFERENCE | SOMEDAY | TRASH`

**ActionStatus**
`OPEN | COMPLETED | ARCHIVED`

**ProjectStatus**
`ACTIVE | COMPLETED | ARCHIVED`

**TimeBucket**
`short | medium | long`

**EnergyLevel**
`low | medium | high`

---

## 6. Entity Relationship Diagram

```
CapturedItem       (standalone; resolved once, then closed)

Project  1 ──── * Action * ──── 1 Context
                (optional)     (optional)
```