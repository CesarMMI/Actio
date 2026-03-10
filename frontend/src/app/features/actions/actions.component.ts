import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActionsService } from './actions.service';
import { ListItemComponent } from '../../shared/list-item/list-item.component';
import { Action } from '../../core/models/action.model';

@Component({
  selector: 'app-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ListItemComponent],
  template: `
    <div class="max-w-2xl mx-auto px-6 py-10">

        <!-- Header -->
        <div class="flex items-baseline gap-3 mb-8">
          <h1 class="text-neutral-100 text-lg font-medium">Actions</h1>
          @if (actions.items().length > 0) {
            <span class="text-neutral-600 text-sm">{{ actions.items().length }}</span>
          }
        </div>

        <!-- Error -->
        @if (actions.error()) {
          <p class="text-red-400 text-sm mb-4" role="alert">{{ actions.error() }}</p>
        }

        <!-- Loading -->
        @if (actions.loading()) {
          <p class="text-neutral-600 text-sm" aria-live="polite">Loading...</p>
        }

        <!-- Empty state -->
        @if (!actions.loading() && actions.items().length === 0) {
          <p class="text-neutral-700 text-sm text-center py-16">No open actions</p>
        }

        <!-- List -->
        @if (actions.items().length > 0) {
          <ul aria-label="Actions">
            @for (action of actions.items(); track action.id) {
              <app-list-item
                [title]="action.title"
                [subtitle]="action.notes"
                [tags]="buildTags(action)"
                (complete)="actions.complete(action.id)"
                (archive)="actions.archive(action.id)"
              />
            }
          </ul>
        }

    </div>
  `,
})
export class ActionsComponent implements OnInit {
  actions = inject(ActionsService);

  ngOnInit(): void {
    this.actions.load();
  }

  buildTags(action: Action): string[] {
    return [
      action.timeBucket,
      action.energyLevel,
      action.dueDate ? `due ${action.dueDate.slice(0, 10)}` : undefined,
    ].filter((t): t is string => t !== undefined);
  }
}
