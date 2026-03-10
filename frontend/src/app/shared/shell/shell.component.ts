import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex min-h-screen bg-neutral-950">

      <!-- Sidebar -->
      <nav class="w-44 shrink-0 bg-neutral-900 border-r border-neutral-700 flex flex-col px-2 py-6"
           aria-label="Main navigation">
        <span class="text-neutral-100 text-sm font-semibold px-3 mb-8">Actio</span>

        <a routerLink="/inbox" routerLinkActive="text-neutral-100 bg-neutral-800"
           [routerLinkActiveOptions]="{ exact: false }"
           class="text-neutral-500 text-sm px-3 py-2 rounded transition-colors hover:text-neutral-100">
          Inbox
        </a>

        <a routerLink="/actions" routerLinkActive="text-neutral-100 bg-neutral-800"
           [routerLinkActiveOptions]="{ exact: false }"
           class="text-neutral-500 text-sm px-3 py-2 rounded transition-colors hover:text-neutral-100">
          Actions
        </a>

        <a routerLink="/projects" routerLinkActive="text-neutral-100 bg-neutral-800"
           [routerLinkActiveOptions]="{ exact: false }"
           class="text-neutral-500 text-sm px-3 py-2 rounded transition-colors hover:text-neutral-100">
          Projects
        </a>
      </nav>

      <!-- Content -->
      <main class="flex-1 min-w-0">
        <router-outlet/>
      </main>

    </div>
  `,
})
export class ShellComponent {}
