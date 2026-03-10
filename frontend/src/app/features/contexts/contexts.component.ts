import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ContextsService } from './contexts.service';
import { ListItemComponent } from '../../shared/list-item/list-item.component';
import { ContextFormComponent } from './context-form.component';

@Component({
  selector: 'app-contexts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ListItemComponent, ContextFormComponent],
  template: `
    <div class="max-w-2xl mx-auto px-6 py-10">

      <div class="flex items-baseline justify-between mb-8">
        <div class="flex items-baseline gap-3">
          <h1 class="text-neutral-100 text-lg font-medium">Contexts</h1>
          @if (contexts.items().length > 0) {
            <span class="text-neutral-600 text-sm">{{ contexts.items().length }}</span>
          }
        </div>
        @if (!showCreateForm()) {
          <button
            (click)="showCreateForm.set(true)"
            class="bg-neutral-100 text-neutral-900 text-sm px-4 py-2 rounded hover:bg-white transition-colors"
          >New context</button>
        }
      </div>

      @if (showCreateForm()) {
        <div class="bg-neutral-900 border border-neutral-700 rounded p-4 mb-8">
          <h2 class="text-neutral-400 text-xs uppercase tracking-wider mb-4">New context</h2>
          <app-context-form
            submitLabel="Create"
            [saving]="contexts.saving()"
            (save)="onCreate($event)"
            (cancel)="showCreateForm.set(false)"
          />
        </div>
      }

      @if (contexts.error()) {
        <p class="text-red-400 text-sm mb-4" role="alert">{{ contexts.error() }}</p>
      }

      @if (contexts.loading()) {
        <p class="text-neutral-600 text-sm" aria-live="polite">Loading...</p>
      }

      @if (!contexts.loading() && contexts.items().length === 0) {
        <p class="text-neutral-700 text-sm text-center py-16">No contexts</p>
      }

      @if (contexts.items().length > 0) {
        <ul aria-label="Contexts">
          @for (context of contexts.items(); track context.id) {
            @if (editingId() === context.id) {
              <li class="py-4 border-b border-neutral-800 last:border-0">
                <app-context-form
                  [initialTitle]="context.title"
                  submitLabel="Save"
                  [saving]="contexts.saving()"
                  (save)="onUpdate(context.id, $event)"
                  (cancel)="editingId.set(null)"
                />
              </li>
            } @else {
              <app-list-item
                [title]="context.title"
                [titleLink]="['/contexts', context.id]"
                (edit)="editingId.set(context.id)"
                (delete)="contexts.delete(context.id)"
              />
            }
          }
        </ul>
      }

    </div>
  `,
})
export class ContextsComponent implements OnInit {
  contexts = inject(ContextsService);
  showCreateForm = signal(false);
  editingId = signal<string | null>(null);

  ngOnInit(): void {
    this.contexts.load();
  }

  onCreate(title: string): void {
    this.contexts.create(title, () => this.showCreateForm.set(false));
  }

  onUpdate(id: string, title: string): void {
    this.contexts.update(id, title, () => this.editingId.set(null));
  }
}
