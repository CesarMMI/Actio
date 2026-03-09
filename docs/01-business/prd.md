# Actio — Product Requirements Document

## Product Overview

**Actio** helps users manage their work by giving every idea, task, and obligation a place to land and a clear path to resolution. Inspired by GTD, it strips the methodology to its most valuable core: get things out of your head, decide what they are, organize them, and act on them.

---

## Goals

- Zero-friction capture: anything can be captured immediately as text
- Clear resolution: every captured item gets processed into a known state
- Organized execution: actions are grouped by projects and contexts for focused work
- Inline resolve: users can skip the inbox and capture + resolve in one step

## Non-Goals (V1)

- Authentication and user accounts
- Rich media capture (images, files, links)
- Recurring or repeating tasks
- Calendar integration and reminders
- Review workflows (weekly review, etc.)
- Team collaboration or sharing

---

## Core Concepts

### Captured Item (Inbox)

The entry point for everything. A captured item is something the user noticed, thought of, or needs to deal with — but hasn't decided what it is yet. In v1, captured items are text only.

A captured item can be resolved into:
- An **Action** — something to do
- A **Project** — a goal that requires multiple actions
- **Reference** — useful information, no action needed
- **Someday/Maybe** — not now, but keep it
- **Trash** — not needed

### Action

A concrete, single step the user can perform. Actions are the primary unit of execution in the system.

An action can belong to a **Project** (what goal does this serve?) and/or a **Context** (where or how can this be done?).

Optional metadata:
- Due date
- Time bucket (short / medium / long — how long will it take?)
- Energy level (low / medium / high — how much focus does it require?)

### Project

A goal or outcome that requires more than one action to complete. Projects exist to group related actions together. A project cannot be marked complete until all its actions are resolved.

### Context

A condition or location under which actions can be done. Examples: @computer, @phone, @errands, @home. Contexts allow users to filter their action list to only what's possible right now.

---

## User Flows

### Flow A — Quick Capture
User enters an item title → item is saved to the Inbox. No decisions required.

### Flow B — Capture + Resolve Inline
User enters an item title and immediately resolves it (assigns it to a project/context, sets it as an action). Item bypasses the inbox and is created directly as an Action.

### Flow C — Process Inbox
User opens the Inbox and sees all unresolved captured items. For each item, they choose a resolution:
- **Make Action** → becomes an Action (optionally assign project, context, due date)
- **Make Project** → becomes a Project
- **Reference** → archived as reference material
- **Someday/Maybe** → deferred, kept for future consideration
- **Trash** → discarded

Once resolved, a captured item cannot be re-processed.

### Flow D — Execute by Context
User selects a Context → sees all open Actions for that context → marks actions done.

### Flow E — View by Project
User opens a Project → sees all associated Actions → can mark them done.

---

## Functional Requirements

### Capture
- User can create a captured item with only a title (required) and optional notes
- A captured item defaults to Inbox status upon creation
- User can capture and immediately resolve an item as an Action in one operation (inline resolve), assigning optional project, context, and due date at that moment

### Clarify (Inbox Processing)
- User can resolve a captured item as an Action
- User can resolve a captured item as a Project
- User can mark a captured item as Reference
- User can mark a captured item as Someday/Maybe
- User can trash a captured item
- A captured item that has already been resolved cannot be resolved again

### Actions
- An Action has: title (required), notes (optional), due date (optional), time bucket (optional: short / medium / long), energy level (optional: low / medium / high)
- An Action can be assigned to at most one Project
- An Action can be assigned to at most one Context
- An Action can be marked as complete
- A completed Action can be archived
- Actions can be listed filtered by context, time bucket, energy level, and due date range

### Projects
- A Project has: name (required), description (optional)
- A Project contains zero or more Actions
- A Project can only be marked complete if all its Actions are completed or archived
- A completed Project can be archived
- A Project can be renamed

### Contexts
- A Context has: name (required), description (optional)
- A Context can be activated or deactivated
- A Context can be renamed

---

## Future Considerations (Post-V1)

- User authentication and accounts
- Rich capture: images, file attachments, URLs/links
- Weekly review workflow
- Recurring tasks
- Due date reminders and notifications
- Mobile app
- Tags as an additional organizational layer
- Sharing and collaboration
