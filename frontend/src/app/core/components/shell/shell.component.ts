import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex min-h-screen bg-neutral-900">
      <nav
        class="w-44 shrink-0 bg-neutral-950 flex flex-col px-2 py-6"
        aria-label="Main navigation"
      >
        <span class="text-neutral-100 text-sm font-semibold px-3 mb-8">Actio</span>

        <a
          routerLink="/tasks"
          routerLinkActive="text-neutral-100 bg-neutral-900"
          [routerLinkActiveOptions]="{ exact: false }"
          class="text-neutral-500 text-sm px-3 py-2 rounded transition-colors hover:text-neutral-100"
        >
          Tasks
        </a>

        <a
          routerLink="/projects"
          routerLinkActive="text-neutral-100 bg-neutral-900"
          [routerLinkActiveOptions]="{ exact: false }"
          class="text-neutral-500 text-sm px-3 py-2 rounded transition-colors hover:text-neutral-100"
        >
          Projects
        </a>

        <a
          routerLink="/contexts"
          routerLinkActive="text-neutral-100 bg-neutral-900"
          [routerLinkActiveOptions]="{ exact: false }"
          class="text-neutral-500 text-sm px-3 py-2 rounded transition-colors hover:text-neutral-100"
        >
          Contexts
        </a>
      </nav>

      <main class="flex-1 min-w-0">
        <router-outlet />
      </main>
    </div>
  `,
})
export class ShellComponent {}
