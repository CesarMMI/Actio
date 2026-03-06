---
name: gtd-task-app-prd
overview: Prepare a product requirements document for a simple GTD-inspired web app that helps users capture, clarify, organize, and execute tasks and projects, without implementing complex review workflows.
todos:
  - id: outline-prd
    content: Finalize the detailed PRD section outline and headings for the GTD-inspired task manager, balancing GTD concepts with product simplicity.
    status: completed
  - id: draft-prd
    content: Write the complete PRD for the GTD-inspired task manager web app following the agreed outline and user constraints.
    status: completed
  - id: review-prd
    content: Review and refine the PRD for clarity, consistency, and explicit in-scope/out-of-scope boundaries.
    status: completed
isProject: false
---

## GTD-Inspired Task Manager PRD Plan

### Scope and assumptions

- **Target users**: Individual knowledge workers and students managing personal tasks and small projects (not full enterprise teams).
- **Platforms**: Responsive web app (desktop-first, mobile-friendly); no native apps in this PRD.
- **GTD usage**: Use GTD as a conceptual inspiration (capture, clarify, organize, execute) without full GTD rigor (no full reviews, tickler files, horizons of focus, etc.).
- **Account model**: Single-user accounts; no shared workspaces or collaboration in this initial PRD.

### PRD structure I will deliver

- **1. Product summary & background**
  - Problem statement and why existing tools are insufficient for the target user.
  - High-level solution: a lightweight GTD-inspired workflow.
- **2. Goals and non-goals**
  - Primary goals: frictionless capture, clear next actions, simple project structure, context-based execution.
  - Explicit non-goals for v1: team collaboration, calendar integration, full GTD review system.
- **3. User personas & key use cases**
  - 2–3 concise personas (e.g., busy professional, student/maker).
  - Core use cases aligned with the user’s list: capture, clarify, organize, execute.
- **4. User journeys / flows**
  - Narrative flows for: capturing an item, clarifying it, organizing into projects/contexts, and executing from a context-centric view.
  - Simple flow diagram (mermaid) illustrating the lifecycle of a captured item from inbox to completion.
- **5. Functional requirements**
  - **Capture**: inbox, quick-add patterns, basic metadata (title, notes, optional project/context, optional due date).
  - **Clarify**: rules for turning captured items into actions or projects; handling reference and trash; constraints on what counts as an actionable item.
  - **Organize**: projects, actions, and contexts with the relationships the user described; ability to see actions by project and by context; minimal navigation structure.
  - **Execute**: context views, simple filters (e.g., by energy/time, due date), and marking actions done.
  - For each area, include numbered, testable requirements.
- **6. Data model & domain concepts**
  - Define the four core entities given by the user (Captured Item, Action, Project, Context) and their relationships.
  - Distinguish conceptual model (domain language) from implementation model (how they’re likely stored/linked) without going into technology specifics.
- **7. Non-functional requirements**
  - UX principles: low-friction capture, clarity over configuration, sensible defaults.
  - Performance and scalability expectations appropriate for a small single-user SaaS.
  - Security and privacy baselines (authentication, data protection at a high level).
- **8. Out of scope & future considerations**
  - Explicitly list items excluded from v1 (e.g., reviews, advanced automations, integrations) and note as future iterations.

### Todos

- **outline-prd**: Finalize the exact section outline and headings for the PRD, tuned to the user’s preferences for simplicity vs. GTD fidelity.
- **draft-prd**: Write the full PRD text following the outline, with clear, testable requirements and GTD-inspired but simplified flows.
- **review-prd**: Do a pass to ensure the PRD is consistent, non-contradictory, and clearly marks what is in-scope vs. out-of-scope for v1.

