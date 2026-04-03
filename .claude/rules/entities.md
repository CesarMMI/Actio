# NoteGraph — Entities

> System entity definitions, their properties, and relationships

| Field   | Detail     |
|---------|------------|
| Version | 5.0        |
| Date    | 04/02/2026 |

---

## 1. Entity Map

```
┌──────────┐        0..1         ┌────────────┐
│   Note   │ ──────────────────► │  Category  │
│          │    belongs to       │            │
└────┬─────┘                     └────────────┘
     │
     │ 0..N
     │ references (note or section)
     ▼
┌──────────┐
│   Note   │
└──────────┘
```

The system has three entities: **Note**, **Category**, and **Reference** (which materializes the reference relationship between notes, and can point to the entire note or to a specific section).

---

## 2. Note

Main content unit. Represents a user's note with a title and Markdown body.

### Properties

| Property      | Type              | Required | Description                                                            |
|---------------|-------------------|----------|------------------------------------------------------------------------|
| `id`          | UUID              | Yes      | Unique identifier. Immutable after creation.                           |
| `title`       | string (max 50)   | Yes      | Note title. Does not need to be unique. Cannot contain `[` or `]`.     |
| `body`        | string            | No       | Markdown body (CommonMark). May be empty.                              |
| `category_id` | UUID \| null      | No       | Reference to the associated category. `null` if no category.           |
| `created_at`  | datetime (UTC)    | Yes      | Creation date/time. Set once, never changed.                           |
| `updated_at`  | datetime (UTC)    | Yes      | Last edit date/time. Updated on each modification.                     |

### Sections

Markdown headings in the body (`#`, `##`, `###`, etc.) are treated as referenceable sections. Each heading automatically generates a `section_id` derived from its text, using the following normalization (slug):

1. Convert to lowercase.
2. Remove special characters (keep letters, numbers, spaces, and hyphens).
3. Replace spaces with hyphens.
4. Remove consecutive hyphens.

**Examples:**

| Heading                  | `section_id`           |
|--------------------------|------------------------|
| `## Introduction`        | `introduction`         |
| `## How to Install`      | `how-to-install`       |
| `### Node.js API`        | `nodejs-api`           |
| `## 2. Configuration`    | `2-configuration`      |

**Rules:**

- The `section_id` is derived, not stored — it is recalculated from the body whenever needed.
- If two headings in the same note generate the same slug, the second receives a numeric suffix (`configuration`, `configuration-1`, `configuration-2`).
- Renaming or removing a heading invalidates references that pointed to the previous `section_id` (partial orphan link — see Reference).

### Relationships

| Relationship                 | Cardinality   | Description                                                                                  |
|------------------------------|---------------|----------------------------------------------------------------------------------------------|
| Note → Category              | N:1 (0..1)    | A note can have zero or one category. A category can be associated with many notes.          |
| Note → Note (via Reference)  | N:N           | A note can reference many notes and be referenced by many notes, through the Reference entity. |

### Rules

- Duplicate titles are allowed — notes are differentiated by `id`.
- The title cannot contain the characters `[` or `]` (reserved for reference syntax).
- Title limited to 50 characters.
- Body has no size limit.
- A note with only a title (empty body) is valid.

---

## 3. Category

Flat label for thematic grouping of notes.

### Properties

| Property     | Type                 | Required | Description                                                             |
|--------------|----------------------|----------|-------------------------------------------------------------------------|
| `id`         | UUID                 | Yes      | Unique identifier. Immutable after creation.                            |
| `name`       | string (max 50)      | Yes      | Category name. Does not need to be unique.                              |
| `color`      | string (hex) \| null | No       | Color in `#RRGGBB` format. If `null`, the interface applies a default color. |
| `created_at` | datetime (UTC)       | Yes      | Creation date/time.                                                     |
| `updated_at` | datetime (UTC)       | Yes      | Last edit date/time. Updated on each modification.                      |

### Relationships

| Relationship    | Cardinality | Description                                        |
|-----------------|-------------|----------------------------------------------------|
| Category → Note | 1:N         | A category can be associated with many notes.      |

### Rules

- Categories are flat — no hierarchy, no subcategories.
- Duplicate names are allowed — differentiated by `id`.
- Name limited to 50 characters.
- When deleting a category, all associated notes become uncategorized (`category_id = null`).

---

## 4. Reference

Materializes the reference relationship between two notes. Created from the `[display text]<note_id>` or `[display text]<note_id#section_id>` syntax present in a note's body.

### Syntax

**Reference to entire note:**

```
[display text]<note_id>
```

**Reference to specific section:**

```
[display text]<note_id#section_id>
```

- **`display text`** — free text chosen by the user. It is what appears visually in the note body.
- **`note_id`** — UUID of the referenced note.
- **`section_id`** (optional) — slug of the referenced heading in the target note.

**Examples:**

```markdown
See more details at [How IPC works]<a3f2c1d4-7b8e-4a1f-9c2d-e5f6a7b8c9d0>.

For installation, see [this section]<a3f2c1d4-7b8e-4a1f-9c2d-e5f6a7b8c9d0#how-to-install>.

Related to [that bug]<b4c5d6e7-8b9c-0d1e-2f3a-4b5c6d7e8f9a#root-cause>.
```

### Properties

| Property       | Type              | Required | Description                                                                              |
|----------------|-------------------|----------|------------------------------------------------------------------------------------------|
| `source_id`    | UUID              | Yes      | ID of the note that contains the reference.                                              |
| `target_id`    | UUID \| null      | No       | ID of the referenced note. `null` if the target note was deleted (total orphan link).    |
| `section_id`   | string \| null    | No       | Slug of the referenced heading in the target note. `null` if the reference points to the entire note. |
| `display_text` | string            | Yes      | Text displayed in the reference. Preserved regardless of link state.                     |
| `updated_at`   | datetime (UTC)    | Yes      | Date/time of the last recalculation of this reference.                                   |

### Reference states

A reference can be in three states:

| State                  | Condition                                                       | Description                                                          |
|------------------------|-----------------------------------------------------------------|----------------------------------------------------------------------|
| **Valid**              | `target_id` is not `null` and `section_id` is `null` or exists in the target note | The reference points to a note (and section, if applicable) that exists. |
| **Total orphan link**  | `target_id` is `null`                                           | The referenced note was deleted. The link is completely broken.      |
| **Partial orphan link**| `target_id` is not `null`, but `section_id` doesn't exist in the target note | The note exists, but the referenced heading was removed or renamed.  |

### Relationships

| Relationship                 | Cardinality    | Description                                                                  |
|------------------------------|----------------|------------------------------------------------------------------------------|
| Reference → Note (source)    | N:1            | Many references can originate from the same note.                            |
| Reference → Note (target)    | N:1 (0..1)     | Many references can point to the same note. `null` if total orphan link.     |

### Rules

- The reference is linked by **note `id`**, not by title. Renaming a note does not break any reference.
- The `display_text` is free — the user chooses what to display. It doesn't need to be the referenced note's title.
- When saving a note, all references with `source_id` of that note are recalculated (delete + recreate from the body).
- When deleting a note, references that pointed to it have `target_id` set to `null` (total orphan link).
- Partial orphan link is detected at read time: the stored `section_id` is compared with the current headings of the target note. If the heading no longer exists, the reference is treated as partially broken.
- The interface must visually differentiate the three states (valid, total orphan, partial orphan).

---

## 5. Relationship Diagram

```
┌───────────────────────┐
│       Category        │
│───────────────────────│
│ id           UUID     │
│ name         string   │
│ color        hex?     │
│ created_at   datetime │
│ updated_at   datetime │
└──────────┬────────────┘
           │
           │ 1:N (0..1 on the Note side)
           │
┌──────────▼────────────┐         ┌──────────────────────────┐
│         Note          │         │        Reference         │
│───────────────────────│         │──────────────────────────│
│ id           UUID     │◄────────│ source_id      UUID      │
│ title        string   │    N:1  │ target_id      UUID?     │──────┐
│ body         string?  │         │ section_id     string?   │      │
│ category_id  UUID?    │         │ display_text   string    │      │
│ created_at   datetime │         │ updated_at     datetime  │      │
│ updated_at   datetime │         └──────────────────────────┘      │
└───────────────────────┘                                           │
           ▲                                                        │
           │                N:1 (0..1)                              │
           └────────────────────────────────────────────────────────┘
               Reference.target_id → Note.id (nullable)
```
