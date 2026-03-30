---
description: Build React pages and components for NoteGraph following the design system and renderer architecture.
---

You are building React UI for the NoteGraph project (Electron + React 18 + TypeScript + CSS Modules).

## What to Build
$ARGUMENTS

---

## Step 1 — Read context

Before writing any code, read:
- `@.claude/plans/00_master_prd.md` — MVP scope and UX goals
- `@.claude/plans/04_arquitetura.md` — renderer module contracts and folder structure
- `@.claude/plans/03_modelo_dados.md` — data shapes passed to the UI layer

Then inventory what already exists to avoid duplication:
- Glob `src/renderer/**/*.tsx` — existing components and views
- Glob `src/renderer/**/*.module.css` — existing stylesheets
- Glob `src/renderer/hooks/**/*.ts` — existing IPC hooks

---

## Step 2 — Reuse check

Before creating any new component, ask: does an existing component in `src/renderer/components/` already satisfy this need?
- If yes → extend it with a new prop rather than creating a new file.
- If no match → create a new component.

Do NOT create a new component just to wrap an existing one with minor styling differences. Use CSS Modules class variants (`styles.primary`, `styles.ghost`) or an explicit `variant` prop instead.

---

## Step 3 — Design token bootstrap

Check whether `src/renderer/styles/tokens.css` exists.

If it does **not** exist, create it with the following content **before writing any component**:

```css
/* src/renderer/styles/tokens.css */
/* NoteGraph design tokens — import once in App.tsx, never per-component */

:root {
  /* Backgrounds — hierarchy through color, not borders */
  --bg-base:     #0d0d0f;   /* app shell background */
  --bg-surface:  #111113;   /* panels, sidebars */
  --bg-elevated: #17171a;   /* cards, list items */
  --bg-hover:    #1c1c20;   /* hover state */
  --bg-active:   #22222a;   /* selected / active */

  /* Primary — purple accent */
  --primary:       #8b5cf6;
  --primary-hover: #7c3aed;

  /* Text */
  --text-primary:   #f4f4f5;
  --text-secondary: #a1a1aa;
  --text-disabled:  #52525b;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;

  /* Spacing scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;

  /* Typography */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
  --text-xs:   11px;
  --text-sm:   13px;
  --text-base: 15px;
  --text-lg:   18px;
  --text-xl:   22px;
}
```

Then add a single import at the top of `src/renderer/App.tsx` (or `src/renderer/renderer.ts` if App doesn't exist yet):

```ts
import './styles/tokens.css';
```

Do **not** import `tokens.css` inside individual components.

---

## Step 4 — Build components bottom-up

Build shared leaf components **before** composing them in views.

### File layout

| What | Path |
|------|------|
| Shared component | `src/renderer/components/<name>/<Name>.tsx` + `<Name>.module.css` |
| Page/view | `src/renderer/views/<name>/<Name>View.tsx` + `<Name>View.module.css` |
| IPC hook | `src/renderer/hooks/use<Name>.ts` |

### Design rules (non-negotiable)

1. **No `border` or `box-shadow`** — use `background-color` differences and whitespace to separate regions.
2. **Spacing is structure** — use `--space-*` tokens; be generous with padding to let content breathe.
3. **One interaction color** — `--primary` for focus rings, active selections, and primary CTAs only. Everything else uses background shifts.
4. **CSS Modules only** — one `.module.css` per component file. No inline styles (`style={{}}`). No global class names.
5. **Dark by default** — every element defaults to dark background; no light surfaces.

### CSS module template

```css
/* Example component stylesheet */
.root {
  background: var(--bg-elevated);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-sans);
  color: var(--text-primary);
}

.root:hover {
  background: var(--bg-hover);
}

.root:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
```

### React component rules

- **React hooks only** — no class components.
- **Explicit props interface** — always declare `interface <Name>Props { ... }` before the component.
- **No `any`** — use `unknown` + type guard for raw IPC data.
- **Reuse types from `src/main/types/`** — do NOT redeclare types already defined there.
- **Components never call `window.electronAPI` directly** — all IPC goes through hooks in `src/renderer/hooks/`.
- Local UI state only (`useState`, `useReducer`) — no global store.

### IPC hook template (when needed)

```ts
// src/renderer/hooks/useNotes.ts
import { useState, useEffect } from 'react';
import type { Note } from '../../main/types/notes/note';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.electronAPI.invoke('note:list')
      .then((result: unknown) => {
        // narrow unknown → Note[]
        setNotes(result as Note[]);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Unknown error');
      })
      .finally(() => setLoading(false));
  }, []);

  return { notes, loading, error };
}
```

---

## Step 5 — Output summary

After writing all files, output:

1. A table of every file **created or modified** with a one-line description.
2. Visual test instruction: run `npm start` (or `electron-forge start`) and navigate to the relevant view.
3. Any design decisions made (e.g. reused an existing component, added a variant prop) that are not obvious from the code.
