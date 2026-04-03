# NoteGraph — Use Cases

> System flows and business rules

| Field   | Detail     |
|---------|------------|
| Version | 3.0        |
| Date    | 04/02/2026 |

---

## 1. Notes

### UC-01 — Create note

**Trigger:** User requests the creation of a new note.

**Flow:**

1. User provides title, body (optional), and category (optional).
2. System validates:
   - Title is not empty.
   - Title ≤ 50 characters.
   - Title does not contain `[` or `]`.
3. System generates a unique identifier (UUID) for the note.
4. System sets `created_at` and `updated_at` to the current date/time.
5. System persists the note.
6. System extracts all `[...]<...>` references from the body and creates the corresponding Reference records (see UC-08).
7. System returns the created note.

**Errors:**

- Empty title → reject.
- Title exceeds 50 characters → reject.
- Title contains `[` or `]` → reject.

---

### UC-02 — Edit note

**Trigger:** User modifies the title, body, and/or category of an existing note.

**Flow:**

1. User submits the changes.
2. System validates (same title rules as UC-01, if the title was changed).
3. System updates the modified fields and sets `updated_at` to the current date/time.
4. System persists the changes.
5. If the body was changed:
   - System recalculates the note's references (see UC-08).
   - System checks if headings were removed or renamed — references from other notes pointing to affected sections become partial orphan links (see UC-10).
6. System returns the updated note.

**Rules:**

- Renaming a note **does not** require cascading updates in other notes' bodies — references are linked by `id`, not by title.
- Renaming or removing a heading **may** generate partial orphan links in other notes that referenced that section.

---

### UC-03 — Delete note

**Trigger:** User requests the deletion of a note.

**Flow (two steps):**

**Step 1 — Verification:**

1. System identifies all References where `target_id` points to this note (notes that reference it).
2. System returns the list and count of references that will be broken.
3. Interface displays a warning to the user.

**Step 2 — Confirmation:**

4. User confirms the deletion.
5. System removes the note.
6. System removes all References where `source_id` is the deleted note.
7. System updates all References where `target_id` is the deleted note: sets `target_id = null` (making them total orphan links).
8. System returns a success confirmation.

**Rules:**

- Deletion is allowed even with active references pointing to the note.
- The generated orphan links remain in the referencing notes' bodies — the `[display text]<id>` text is not automatically removed. The user decides what to do with them.

---

### UC-04 — View note

**Trigger:** User selects a note for reading/editing.

**Flow:**

1. System retrieves the note by `id`.
2. System returns all note fields (title, body, category, dates).
3. Interface loads the content in the editor.

---

### UC-05 — List notes

**Trigger:** User opens the system or needs to view the list of notes.

**Flow:**

1. System returns all notes with their summarized fields (`id`, `title`, `category_id`, `updated_at`).

---

## 2. Categories

### UC-06 — Create category

**Trigger:** User requests the creation of a new category.

**Flow:**

1. User provides name and color (optional).
2. System validates:
   - Name is not empty.
   - Name ≤ 50 characters.
   - Color, if provided, is a valid hex in `#RRGGBB` format.
3. System generates a unique identifier (UUID).
4. System sets `created_at` and `updated_at` to the current date/time.
5. System persists the category.
6. System returns the created category.

**Errors:**

- Empty name → reject.
- Name exceeds 50 characters → reject.
- Invalid color format → reject.

---

### UC-07 — Edit category

**Trigger:** User modifies the name and/or color of an existing category.

**Flow:**

1. User submits the changes.
2. System validates (same rules as UC-06).
3. System updates the category and sets `updated_at` to the current date/time.
4. System returns the updated category.

**Rules:**

- Changing a category's name or color does not affect the association with notes — the link is made by `id`, not by name.

---

### UC-07b — Delete category

**Trigger:** User requests the deletion of a category.

**Flow (two steps):**

**Step 1 — Verification:**

1. System counts how many notes have `category_id` pointing to this category.
2. System returns the count for confirmation.

**Step 2 — Confirmation:**

3. User confirms the deletion.
4. System sets `category_id = null` on all associated notes.
5. System removes the category.
6. System returns a success confirmation.

---

### UC-07c — List categories

**Trigger:** User opens the categories panel or any interface that displays available categories.

**Flow:**

1. System returns all categories with their fields (`id`, `name`, `color`, `created_at`, `updated_at`).

---

## 3. References

### Reference syntax

The reference between notes in the Markdown body follows two formats:

**For the entire note:**

```
[display text]<note_id>
```

**For a specific section:**

```
[display text]<note_id#section_id>
```

- **`display text`** — free text chosen by the user.
- **`note_id`** — UUID of the referenced note.
- **`section_id`** (optional) — slug of the referenced heading, automatically generated from the heading text (e.g., `## How to Install` → `how-to-install`).

**Examples:**

```markdown
See more at [How IPC works]<a3f2c1d4-7b8e-4a1f-9c2d-e5f6a7b8c9d0>.

For installation, see [this section]<a3f2c1d4-7b8e-4a1f-9c2d-e5f6a7b8c9d0#how-to-install>.

Related to [that bug]<b4c5d6e7-8b9c-0d1e-2f3a-4b5c6d7e8f9a#root-cause>.
```

---

### UC-08 — Extract references on note save

**Trigger:** A note is created (UC-01) or edited with body changes (UC-02).

**Flow:**

1. System removes all existing References where `source_id` is the saved note.
2. System parses the note body and extracts all occurrences of the `[text]<id>` and `[text]<id#section>` syntax.
3. For each reference found:
   - Checks if a note with the extracted `id` exists.
   - If it exists: creates a Reference with `target_id` filled in and `section_id` if present.
   - If it doesn't exist: creates a Reference with `target_id = null` (total orphan link).
   - The `display_text` is extracted from the text between `[` and `]`.
4. System sets `updated_at` of each Reference to the current date/time.

**Rules:**

- Recalculation strategy is delete + recreate: all references from the note are removed and recreated from scratch on each save.
- The reference is linked by `id`, not by title. Non-existent IDs generate total orphan links.
- Validation of `section_id` (whether the heading exists in the target note) is not done at this time — it is checked at read time (UC-10).

---

### UC-09 — Reference autocomplete in editor

**Trigger:** User starts inserting a reference in the editor.

**Flow:**

1. System activates the autocomplete panel.
2. User types to filter — the system searches for notes whose title contains the typed text (substring search).
3. User selects a note from the list.
4. System displays the selected note's headings as a second selection layer (optional):
   - If the user selects a heading: system inserts `[Heading Text]<id#section_id>`.
   - If the user doesn't select any heading (chooses the entire note): system inserts `[Note Title]<id>`.
5. The user can freely edit the `display_text` after insertion.

**Rules:**

- The autocomplete suggests the note title (or heading text) as the default `display_text`, but the user can change it to any text.
- If there are notes with duplicate titles, the autocomplete must display a differentiator (e.g., ID fragment) so the user can distinguish between them.

---

### UC-10 — Detect partial orphan links

**Trigger:** User opens a note for viewing (UC-04), or a target note has its headings changed (UC-02).

**Flow:**

1. System identifies the note's References that have `section_id` filled in and `target_id` not `null`.
2. For each one, system extracts the current headings from the target note and generates the corresponding slugs.
3. Compares the reference's `section_id` with the existing slugs:
   - If found: valid reference — navigates to the section.
   - If not found: partial orphan link — the note exists, but the heading doesn't.
4. Interface visually differentiates the three states:
   - **Valid:** normal link.
   - **Total orphan** (`target_id = null`): completely broken link.
   - **Partial orphan** (`target_id` exists, `section_id` not found): partially broken link.

**Rules:**

- Partial orphan links are detected at read time, not write time. The `section_id` stored in the Reference is not removed when the heading disappears — it remains so the user can identify which section was referenced.
- If the user clicks a partial orphan link, the system navigates to the target note (top of note), since the section no longer exists.

---

## 4. Search

### UC-11 — Global search

**Trigger:** User types a term in the search field.

**Flow:**

1. User provides the search term and, optionally, a category for filtering.
2. System searches by substring in titles and bodies of all notes.
3. If a category was provided, filters results by `category_id`.
4. System sorts the results:
   - Primary criterion: number of term occurrences in the note (descending).
   - Tiebreaker: most recent `updated_at` first.
5. System returns results with `id`, `title`, body snippet containing the found term, `category_id`, and `updated_at`.

**Rules:**

- The search is executed locally — no data leaves the user's machine.
- The search uses debounce (~300ms) to avoid excessive executions while the user types.
- In the MVP, only simple substring search — no operators (AND, OR, quotes).
- The search does not cover metadata (dates, IDs). Category filter uses the dedicated field, not the search text.
- The body is searched in plain text (Markdown syntax and references removed) to avoid false positives.

---

## 5. Graph

### UC-12 — View global graph

**Trigger:** User opens the graph view (default mode).

**Flow:**

1. System builds the nodes:
   - Each note → a "note" type node.
   - Each category → a "category" type node (visually differentiated: distinct shape and/or color).
2. System builds the edges:
   - Each Reference where `target_id` is not `null` → an edge between source note and target note ("reference" type). References to different sections of the same note generate a single edge.
   - Each note with `category_id` filled in → an edge between note and category ("category" type).
3. System returns nodes and edges.
4. Interface renders the graph with automatic layout.

**Rules:**

- All notes appear in the graph, including isolated notes (with no edges).
- Total orphan links (`target_id = null`) **do not generate edges**.
- Partial orphan links (`target_id` exists, invalid `section_id`) **generate normal edges** — the link between notes exists, only the section is broken.
- The layout is recalculated on each opening — it is not persisted between sessions in the MVP.
- Notes with orphan links may display a visual indicator (e.g., warning icon), but without creating phantom edges.

---

### UC-13 — Focus mode in graph

**Trigger:** User selects a note in the graph to focus on.

**Flow:**

1. System filters the graph to display only:
   - The selected note.
   - Its direct neighbors (1 degree of separation): notes connected by reference and the associated category.
2. The remaining nodes are hidden or shown with reduced emphasis.

**Rules:**

- The transition between global mode and focus mode must be smooth.
- Clicking on the graph background (empty area) restores global mode.

---

### UC-14 — Interact with graph node

**Trigger:** User clicks on a graph node.

**Behavior by node type:**

- **Note node:** opens the note for editing (equivalent to UC-04).
- **Category node:** filters the note list to display only notes in that category.

---

## 6. Summary

| Code   | Use Case                             | Domain      |
|--------|--------------------------------------|-------------|
| UC-01  | Create note                          | Notes       |
| UC-02  | Edit note                            | Notes       |
| UC-03  | Delete note                          | Notes       |
| UC-04  | View note                            | Notes       |
| UC-05  | List notes                           | Notes       |
| UC-06  | Create category                      | Categories  |
| UC-07  | Edit category                        | Categories  |
| UC-07b | Delete category                      | Categories  |
| UC-07c | List categories                      | Categories  |
| UC-08  | Extract references on note save      | References  |
| UC-09  | Reference autocomplete in editor     | References  |
| UC-10  | Detect partial orphan links          | References  |
| UC-11  | Global search                        | Search      |
| UC-12  | View global graph                    | Graph       |
| UC-13  | Focus mode in graph                  | Graph       |
| UC-14  | Interact with graph node             | Graph       |
