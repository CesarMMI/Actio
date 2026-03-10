# Use Cases — Actio v1

This document specifies every use case in the system. Each use case describes its inputs, preconditions, outputs, side effects, and failure paths.

---

## Tasks

### UC-T01 — Create Task

**Description:** Create a new standalone or associated task.

**Input:**
| Field          | Required | Description                                        |
|----------------|----------|----------------------------------------------------|
| `description`  | Yes      | Non-empty text describing the work to be done      |
| `contextId`    | No       | ID of an existing Context to associate             |
| `projectId`    | No       | ID of an existing Project to associate             |

**Preconditions:**
- If `contextId` is provided, the referenced Context must exist.
- If `projectId` is provided, the referenced Project must exist.

**Output:** The created Task object with all fields populated, including system-generated `id`, `createdAt`, and `updatedAt`.

**Side effects:** None beyond the Task itself.

**Failure cases:**
| Condition                                      | Result                  |
|------------------------------------------------|-------------------------|
| `description` is empty or whitespace           | Rejected                |
| `contextId` does not reference an existing Context | Rejected            |
| `projectId` does not reference an existing Project | Rejected            |

---

### UC-T02 — Get Task

**Description:** Retrieve a single Task by its identifier.

**Input:**
| Field | Required | Description          |
|-------|----------|----------------------|
| `id`  | Yes      | ID of the Task       |

**Preconditions:** None.

**Output:** The Task object with all fields, or a not-found error if the ID does not exist.

**Side effects:** None.

**Failure cases:**
| Condition               | Result    |
|-------------------------|-----------|
| `id` does not exist     | Not found |

---

### UC-T03 — List Tasks

**Description:** Retrieve all Tasks in the system.

**Input:** None (filtering is a presentation-layer concern in v1).

**Preconditions:** None.

**Output:** An ordered collection of all Task objects.

**Side effects:** None.

**Failure cases:** None.

---

### UC-T04 — Update Task

**Description:** Modify one or more mutable fields of an existing Task.

**Input:**
| Field         | Required | Description                                             |
|---------------|----------|---------------------------------------------------------|
| `id`          | Yes      | ID of the Task to update                                |
| `description` | No       | New non-empty description                               |
| `contextId`   | No       | New Context ID, or `null` to remove the association     |
| `projectId`   | No       | New Project ID, or `null` to remove the association     |

> Only fields explicitly provided are updated. Omitted fields remain unchanged.

**Preconditions:**
- The Task identified by `id` must exist.
- If `contextId` is provided (and not null), the referenced Context must exist.
- If `projectId` is provided (and not null), the referenced Project must exist.

**Output:** The updated Task object with refreshed `updatedAt`.

**Side effects:** None beyond the Task itself.

**Failure cases:**
| Condition                                          | Result    |
|----------------------------------------------------|-----------|
| `id` does not exist                                | Not found |
| `description` is empty or whitespace               | Rejected  |
| `contextId` references a non-existent Context      | Rejected  |
| `projectId` references a non-existent Project      | Rejected  |

---

### UC-T05 — Delete Task

**Description:** Permanently remove a Task from the system.

**Input:**
| Field | Required | Description          |
|-------|----------|----------------------|
| `id`  | Yes      | ID of the Task       |

**Preconditions:**
- The Task identified by `id` must exist.

**Output:** Confirmation of deletion.

**Side effects:** None.

**Failure cases:**
| Condition           | Result    |
|---------------------|-----------|
| `id` does not exist | Not found |

---

### UC-T06 — Complete Task

**Description:** Mark a Task as done.

**Input:**
| Field | Required | Description        |
|-------|----------|--------------------|
| `id`  | Yes      | ID of the Task     |

**Preconditions:**
- The Task identified by `id` must exist.
- The Task must not already be done.

**Output:** The updated Task object with `done` set to `true`, `doneAt` set to the current timestamp, and refreshed `updatedAt`.

**Side effects:** None.

**Failure cases:**
| Condition                  | Result    |
|----------------------------|-----------|
| `id` does not exist        | Not found |
| Task is already done       | Rejected  |

---

### UC-T07 — Reopen Task

**Description:** Mark a previously completed Task as not done.

**Input:**
| Field | Required | Description        |
|-------|----------|--------------------|
| `id`  | Yes      | ID of the Task     |

**Preconditions:**
- The Task identified by `id` must exist.
- The Task must currently be done.

**Output:** The updated Task object with `done` set to `false`, `doneAt` cleared to `null`, and refreshed `updatedAt`.

**Side effects:** None.

**Failure cases:**
| Condition                  | Result    |
|----------------------------|-----------|
| `id` does not exist        | Not found |
| Task is not done           | Rejected  |

---

## Contexts

### UC-C01 — Create Context

**Description:** Create a new Context.

**Input:**
| Field   | Required | Description                    |
|---------|----------|--------------------------------|
| `title` | Yes      | Non-empty, unique context name |

**Preconditions:**
- No existing Context may share the same `title` (case-insensitive).

**Output:** The created Context object with `id`, `title`, `createdAt`, and `updatedAt`.

**Side effects:** None.

**Failure cases:**
| Condition                                         | Result   |
|---------------------------------------------------|----------|
| `title` is empty or whitespace                    | Rejected |
| A Context with the same title already exists      | Rejected |

---

### UC-C02 — Get Context

**Description:** Retrieve a single Context by its identifier.

**Input:**
| Field | Required | Description       |
|-------|----------|-------------------|
| `id`  | Yes      | ID of the Context |

**Preconditions:** None.

**Output:** The Context object, or a not-found error.

**Side effects:** None.

**Failure cases:**
| Condition           | Result    |
|---------------------|-----------|
| `id` does not exist | Not found |

---

### UC-C03 — List Contexts

**Description:** Retrieve all Contexts in the system.

**Input:** None.

**Preconditions:** None.

**Output:** An ordered collection of all Context objects.

**Side effects:** None.

**Failure cases:** None.

---

### UC-C04 — Update Context

**Description:** Rename an existing Context.

**Input:**
| Field   | Required | Description                        |
|---------|----------|------------------------------------|
| `id`    | Yes      | ID of the Context to update        |
| `title` | Yes      | New non-empty, unique context name |

**Preconditions:**
- The Context identified by `id` must exist.
- No other Context may share the new `title` (case-insensitive).

**Output:** The updated Context object with refreshed `updatedAt`.

**Side effects:** None. Tasks referencing this Context automatically reflect the updated title via the association.

**Failure cases:**
| Condition                                        | Result    |
|--------------------------------------------------|-----------|
| `id` does not exist                              | Not found |
| `title` is empty or whitespace                   | Rejected  |
| Another Context with the same title already exists | Rejected|

---

### UC-C05 — Delete Context

**Description:** Permanently remove a Context from the system.

**Input:**
| Field | Required | Description       |
|-------|----------|-------------------|
| `id`  | Yes      | ID of the Context |

**Preconditions:**
- The Context identified by `id` must exist.
- No Task may currently reference this Context.

**Output:** Confirmation of deletion.

**Side effects:** None.

**Failure cases:**
| Condition                              | Result    |
|----------------------------------------|-----------|
| `id` does not exist                    | Not found |
| One or more Tasks reference this Context | Rejected |

---

## Projects

### UC-P01 — Create Project

**Description:** Create a new Project.

**Input:**
| Field   | Required | Description                    |
|---------|----------|--------------------------------|
| `title` | Yes      | Non-empty, unique project name |

**Preconditions:**
- No existing Project may share the same `title` (case-insensitive).

**Output:** The created Project object with `id`, `title`, `createdAt`, and `updatedAt`.

**Side effects:** None.

**Failure cases:**
| Condition                                        | Result   |
|--------------------------------------------------|----------|
| `title` is empty or whitespace                   | Rejected |
| A Project with the same title already exists     | Rejected |

---

### UC-P02 — Get Project

**Description:** Retrieve a single Project by its identifier.

**Input:**
| Field | Required | Description       |
|-------|----------|-------------------|
| `id`  | Yes      | ID of the Project |

**Preconditions:** None.

**Output:** The Project object, or a not-found error.

**Side effects:** None.

**Failure cases:**
| Condition           | Result    |
|---------------------|-----------|
| `id` does not exist | Not found |

---

### UC-P03 — List Projects

**Description:** Retrieve all Projects in the system.

**Input:** None.

**Preconditions:** None.

**Output:** An ordered collection of all Project objects.

**Side effects:** None.

**Failure cases:** None.

---

### UC-P04 — Update Project

**Description:** Rename an existing Project.

**Input:**
| Field   | Required | Description                        |
|---------|----------|------------------------------------|
| `id`    | Yes      | ID of the Project to update        |
| `title` | Yes      | New non-empty, unique project name |

**Preconditions:**
- The Project identified by `id` must exist.
- No other Project may share the new `title` (case-insensitive).

**Output:** The updated Project object with refreshed `updatedAt`.

**Side effects:** None. Tasks referencing this Project automatically reflect the updated title via the association.

**Failure cases:**
| Condition                                         | Result    |
|---------------------------------------------------|-----------|
| `id` does not exist                               | Not found |
| `title` is empty or whitespace                    | Rejected  |
| Another Project with the same title already exists | Rejected |

---

### UC-P05 — Delete Project

**Description:** Permanently remove a Project from the system.

**Input:**
| Field | Required | Description       |
|-------|----------|-------------------|
| `id`  | Yes      | ID of the Project |

**Preconditions:**
- The Project identified by `id` must exist.
- No Task may currently reference this Project.

**Output:** Confirmation of deletion.

**Side effects:** None.

**Failure cases:**
| Condition                               | Result    |
|-----------------------------------------|-----------|
| `id` does not exist                     | Not found |
| One or more Tasks reference this Project | Rejected |

---

## Use Case Index

| ID      | Name                    | Entity  | Operation |
|---------|-------------------------|---------|-----------|
| UC-T01  | Create Task             | Task    | Create    |
| UC-T02  | Get Task                | Task    | Read      |
| UC-T03  | List Tasks              | Task    | Read      |
| UC-T04  | Update Task             | Task    | Update    |
| UC-T05  | Delete Task             | Task    | Delete    |
| UC-T06  | Complete Task           | Task    | Update    |
| UC-T07  | Reopen Task             | Task    | Update    |
| UC-C01  | Create Context          | Context | Create    |
| UC-C02  | Get Context             | Context | Read      |
| UC-C03  | List Contexts           | Context | Read      |
| UC-C04  | Update Context          | Context | Update    |
| UC-C05  | Delete Context          | Context | Delete    |
| UC-P01  | Create Project          | Project | Create    |
| UC-P02  | Get Project             | Project | Read      |
| UC-P03  | List Projects           | Project | Read      |
| UC-P04  | Update Project          | Project | Update    |
| UC-P05  | Delete Project          | Project | Delete    |
