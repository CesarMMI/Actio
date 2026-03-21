---
name: build-frontend
description: Build, scaffold, or implement Angular 21+ frontend components, pages, services, or features. Use when the user asks to create or modify frontend UI, components, routes, or services in an Angular app.
argument-hint: "[what to build, e.g. 'login page', 'data table component', 'auth service', 'dashboard layout']"
---

# Angular Frontend — Build Skill

You are building a **minimalist Angular 21+ app** using standalone components, signals, and Tailwind CSS.

## Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Framework | Angular 21+ (standalone components, signals)    |
| Styles    | Tailwind CSS v4+ with neutral palette (dark theme) |
| Language  | TypeScript (strict mode)                        |

---

## Design System

### Visual Philosophy

Minimalist and functional. **Dark theme throughout** — all surfaces are dark neutral. No decorative elements. Structure is communicated through:

1. **Spacing** — generous padding/margin to separate logical sections
2. **Background color** — use dark neutral shades (`neutral-900`, `neutral-800`, `neutral-700`) to distinguish regions
3. **Borders** — thin `border border-neutral-700` lines to delimit cards, inputs, and panels
4. **No shadows** — never use `shadow-*` classes

### Tailwind Palette

**Dark theme only.** Use the `neutral` palette inverted — dark backgrounds, light text. No light theme variants.

| Purpose           | Class                              |
|-------------------|------------------------------------|
| Page background   | `bg-neutral-950`                   |
| Surface / card    | `bg-neutral-900`                   |
| Elevated surface  | `bg-neutral-800`                   |
| Divider / border  | `border-neutral-700`               |
| Primary text      | `text-neutral-100`                 |
| Secondary text    | `text-neutral-400`                 |
| Muted / disabled  | `text-neutral-600`                 |
| Input background  | `bg-neutral-800`                   |
| Input border      | `border-neutral-700`               |
| Input focus ring  | `ring-1 ring-neutral-400`          |
| Button primary    | `bg-neutral-100 text-neutral-900`  |
| Button secondary  | `border border-neutral-700 text-neutral-300` |
| Danger / error    | `text-red-400`, `border-red-800`   |
| Success           | `text-green-400`                   |

### Component Visual Patterns

**Card / panel:**
```html
<div class="bg-neutral-900 border border-neutral-700 rounded p-4">...</div>
```

**Section separator:**
```html
<div class="border-t border-neutral-700 my-6"></div>
```

**Input:**
```html
<input class="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-100 text-sm placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-400" />
```

**Primary button:**
```html
<button class="bg-neutral-100 text-neutral-900 text-sm px-4 py-2 rounded hover:bg-white transition-colors">Action</button>
```

**Secondary button:**
```html
<button class="border border-neutral-700 text-neutral-300 text-sm px-4 py-2 rounded hover:bg-neutral-800 transition-colors">Cancel</button>
```

**Page layout:**
```html
<div class="min-h-screen bg-neutral-950">
  <header class="bg-neutral-900 border-b border-neutral-700 px-6 py-4">...</header>
  <main class="max-w-4xl mx-auto px-6 py-8">...</main>
</div>
```

**List item:**
```html
<li class="flex items-center gap-3 py-3 border-b border-neutral-800 last:border-0">...</li>
```

---

## TypeScript Rules

### Core Rules

- **No `any`.** Use `unknown` when the type is uncertain; narrow it before use.
- **Prefer inference.** Only annotate when the type is not obvious or the inference is wrong.
- **`readonly` by default** on properties that must not change after construction.
- **Never widen a type to silence an error.** Fix the root cause instead.

### `type` vs `interface`

| Use `interface` when… | Use `type` when… |
|-----------------------|-----------------|
| Defining an extendable object contract | Creating a union, intersection, or alias |
| Describing a class shape | The type is not an object (e.g., `type Id = string`) |

### Type Narrowing

```typescript
// typeof
if (typeof value === 'string') { /* string here */ }

// instanceof
if (err instanceof HttpErrorResponse) { /* HttpErrorResponse here */ }

// in operator
if ('message' in value) { /* value has 'message' */ }

// Custom type predicate
function isTask(value: unknown): value is Task {
  return typeof value === 'object' && value !== null && 'id' in value;
}
```

### Utility Types

| Utility | Effect |
|---------|--------|
| `Partial<T>` | All properties optional |
| `Required<T>` | All properties required |
| `Readonly<T>` | All properties `readonly` (shallow) |
| `Pick<T, K>` | Keep only properties `K` |
| `Omit<T, K>` | Remove properties `K` |
| `NonNullable<T>` | Remove `null` and `undefined` |
| `Record<K, V>` | Object with keys `K` and values `V` |
| `ReturnType<F>` | Extract return type of `F` |
| `Awaited<T>` | Unwrap `Promise<T>` to `T` |

```typescript
type UpdateInput = Partial<Omit<User, 'id' | 'createdAt'>>;
```

### Discriminated Unions

Use a literal field as discriminant — ideal for async UI state:

```typescript
type LoadState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error';   error: string };
```

### Readonly & Immutability

```typescript
// as const — narrows literal types, great for select option arrays
const SORT_OPTIONS = ['title', 'createdAt', 'updatedAt'] as const;
type SortOption = typeof SORT_OPTIONS[number];

// ReadonlyArray<T> — for component inputs that should not be mutated
function renderList(items: ReadonlyArray<Task>): void { /* ... */ }
```

---

## Angular Architecture Rules

1. **Standalone components always.** Never use NgModules. Every component, directive, and pipe is standalone. Do **not** set `standalone: true` in the decorator — it is the default in Angular v20+ and setting it explicitly is noise.

2. **Signals for state.** Use `signal()`, `computed()`, and `effect()` for all reactive state. Avoid RxJS except for `HttpClient` streams — convert those with `toSignal()`. Never call `.mutate()` on a signal; use `.set()` or `.update()`.

3. **Component inputs/outputs.** Use the `input()` and `output()` functions — never `@Input()` / `@Output()` decorators.

4. **Change detection.** Always set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component`.

5. **Host bindings.** Never use `@HostBinding` or `@HostListener` decorators. Declare host bindings inside the `host` object of `@Component` or `@Directive` instead.

6. **Template control flow.** Use native control flow (`@if`, `@for`, `@switch`) — never `*ngIf`, `*ngFor`, or `*ngSwitch`. Do not assume globals like `new Date()` are available in templates.

7. **No `ngClass` / `ngStyle`.** Use `[class]` and `[style]` bindings directly.

8. **Images.** Use `NgOptimizedImage` for all static images (not for inline base64).

9. **Forms.** Prefer Reactive forms over Template-driven forms.

10. **Feature-based folder structure:**
    ```
    src/app/
    ├── core/           # App-wide services, guards, interceptors, DI tokens
    ├── features/       # One folder per route/feature
    │   └── [feature]/
    │       ├── [feature].component.ts
    │       ├── [feature].service.ts
    │       └── [feature].routes.ts
    └── shared/         # Reusable components (button, input, modal, etc.)
    ```

11. **Route-level lazy loading.** Each feature exports a `Routes` array and is lazy-loaded from `app.routes.ts`.

12. **Services** are `providedIn: 'root'` (singleton) unless feature-scoped. Single responsibility. Use `inject()` — never constructor injection.

13. **Smart/dumb component split.** Smart (container) components inject services and own state. Dumb (presentational) components receive data via `input()` and emit via `output()`.

---

## Accessibility Rules

- Every component **must pass all AXE checks**.
- Must meet **WCAG AA** minimums: focus management, color contrast ratios, correct ARIA attributes.
- Use semantic HTML elements before reaching for ARIA attributes.

---

## Common Patterns

### Standalone Component
```typescript
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-neutral-900 border border-neutral-700 rounded p-4">
      <h2 class="text-neutral-100 font-medium text-sm">{{ title() }}</h2>
    </div>
  `,
})
export class ExampleComponent {
  title = signal('Hello');
}
```

### Signal-based Service with HttpClient
```typescript
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ExampleService {
  private http = inject(HttpClient);
  items = signal<Item[]>([]);

  load() {
    this.http.get<Item[]>('/api/items').subscribe(data => this.items.set(data));
  }
}
```

### Lazy-loaded Feature Route
```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'feature',
    loadChildren: () => import('./features/feature/feature.routes').then(m => m.FEATURE_ROUTES)
  }
];
```

### Form with Reactive Signals
```typescript
name = signal('');
isValid = computed(() => this.name().trim().length > 0);

submit() {
  if (!this.isValid()) return;
  // call service
}
```

---

## Implementation Instructions

When the user asks you to implement `$ARGUMENTS`:

1. **Read existing code first.** Use Glob and Read to understand what already exists. Do not duplicate or overwrite.

2. **Follow Angular conventions.** Use `inject()` for DI. Use `input()`/`output()` functions — no `@Input()`/`@Output()` decorators. No `standalone: true` in decorators. Always set `ChangeDetectionStrategy.OnPush`.

3. **Keep templates inline** for components under ~40 lines; use `templateUrl` for larger ones.

4. **Apply the design system consistently.** Every element must use the neutral palette. No shadows. Separate areas with spacing, background, or borders — never all three at once unless needed.

5. **One file per component.** `component.ts` contains the class, template, and styles. Styles go in Tailwind classes — no component `styles` array unless unavoidable.

6. **Keep it minimal.** Only implement what was asked. No extra abstractions, no placeholder features, no TODO stubs.

7. **Verify Tailwind classes exist.** Only use classes from the Tailwind neutral palette and standard utilities. Do not invent class names.
