import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Context } from '../../../core/models/context.model';
import { ListItemComponent } from '../../../shared/components/list-item/list-item.component';
import { SelectComponent } from '../../../shared/select/components/select.component';
import { SelectOption } from '../../../shared/select/types/select-option';
import { PaginatedListDirective } from '../../../shared/pagination/directives/paginated-list.directive';
import { PaginationComponent } from '../../../shared/pagination/components/pagination.component';
import { ContextFormComponent } from '../components/context-form.component';
import { ContextsService } from '../services/contexts.service';
import { CONTEXT_SORT_MAP, ContextSortOption } from '../types/context-sort';
import { ContextsRequest } from '../types/contexts.api';

@Component({
  selector: 'app-contexts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ListItemComponent, ContextFormComponent, SelectComponent, PaginationComponent],
  template: `
    <div class="max-w-2xl mx-auto px-6 py-10">
      <div class="flex items-baseline justify-between mb-6">
        <div class="flex items-baseline gap-3">
          <h1 class="text-neutral-100 text-lg font-medium">Contexts</h1>
          @if (service.total() > 0) {
            <span class="text-neutral-600 text-sm">{{ service.total() }}</span>
          }
        </div>
        @if (!showCreateForm()) {
          <button
            (click)="showCreateForm.set(true)"
            class="bg-neutral-100 text-neutral-900 text-sm px-4 py-2 rounded hover:bg-white transition-colors"
          >
            New context
          </button>
        }
      </div>

      @if (showCreateForm()) {
        <div class="bg-neutral-900 border border-neutral-700 rounded p-4 mb-6">
          <h2 class="text-neutral-400 text-xs uppercase tracking-wider mb-4">New context</h2>
          <app-context-form
            submitLabel="Create"
            [saving]="service.saving()"
            (save)="onCreate($event)"
            (cancel)="showCreateForm.set(false)"
          />
        </div>
      }

      <!-- Sort bar -->
      <div class="flex items-center justify-end mb-6">
        <app-select
          size="sm"
          [options]="sortOptions"
          [value]="sortOption()"
          ariaLabel="Sort contexts"
          (valueChange)="setSortOption($event)"
        />
      </div>

      @if (service.error()) {
        <p class="text-red-400 text-sm mb-4" role="alert">{{ service.error() }}</p>
      }

      @if (service.loading()) {
        <p class="text-neutral-600 text-sm" aria-live="polite">Loading...</p>
      }

      @if (!service.loading() && service.items().length === 0) {
        <p class="text-neutral-700 text-sm text-center py-16">No contexts</p>
      }

      @if (service.items().length > 0) {
        <ul aria-label="Contexts">
          @for (context of service.items(); track context.id) {
            @if (editingId() === context.id) {
              <li class="py-4 border-b border-neutral-800 last:border-0">
                <app-context-form
                  [initialTitle]="context.title"
                  submitLabel="Save"
                  [saving]="service.saving()"
                  (save)="onUpdate(context.id, $event)"
                  (cancel)="editingId.set(null)"
                />
              </li>
            } @else {
              <app-list-item
                [title]="context.title"
                [titleLink]="['/contexts', context.id]"
                (edit)="editingId.set(context.id)"
                (delete)="service.delete(context.id)"
              />
            }
          }
        </ul>

        <app-pagination
          [page]="service.page()"
          [totalPages]="service.totalPages()"
          (prev)="prevPage()"
          (next)="nextPage()"
        />
      }
    </div>
  `,
})
export class ContextsComponent extends PaginatedListDirective<Context, ContextsRequest> {
  protected override readonly service = inject(ContextsService);

  readonly sortOptions: SelectOption[] = [
    { value: 'title-asc', label: 'Title A → Z' },
    { value: 'title-desc', label: 'Title Z → A' },
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
  ];

  protected override loadPage(page: number): void {
    const { sortBy, order } = CONTEXT_SORT_MAP[this.sortOption() as ContextSortOption];
    this.service.load({ page, sortBy, order });
  }

  onCreate(title: string): void {
    this.service.create(title, () => this.showCreateForm.set(false));
  }

  onUpdate(id: string, title: string): void {
    this.service.update(id, title, () => this.editingId.set(null));
  }
}
