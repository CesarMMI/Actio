import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Task } from '../../../core/models/task.model';
import { PaginationComponent } from '../../../shared/pagination/components/pagination.component';
import { PaginatedListDirective } from '../../../shared/pagination/directives/paginated-list.directive';
import { SelectComponent } from '../../../shared/select/components/select.component';
import { SelectOption } from '../../../shared/select/types/select-option';
import { ContextsService } from '../../contexts/services/contexts.service';
import { ProjectsService } from '../../projects/services/projects.service';
import { TaskListItemComponent } from '../components/task-list-item.component';
import { TaskFormComponent } from '../components/task-form.component';
import { TaskPayload, TasksService } from '../services/tasks.service';
import { TasksRequest } from '../types/task-pagination.api';
import { TASK_SORT_MAP, TaskSortOption } from '../types/task-sort';

@Component({
  selector: 'app-tasks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TaskFormComponent,
    TaskListItemComponent,
    FormsModule,
    SelectComponent,
    PaginationComponent,
  ],
  template: `
    <div class="max-w-2xl mx-auto px-6 py-10">
      <div class="flex items-baseline justify-between mb-6">
        <div class="flex items-baseline gap-3">
          <h1 class="text-neutral-100 text-lg font-medium">Tasks</h1>
          @if (service.total() > 0) {
            <span class="text-neutral-600 text-sm">{{ service.total() }}</span>
          }
        </div>
        @if (!showCreateForm()) {
          <button
            (click)="showCreateForm.set(true)"
            class="bg-neutral-100 text-neutral-900 text-sm px-4 py-2 rounded hover:bg-white transition-colors"
          >
            New task
          </button>
        }
      </div>

      @if (showCreateForm()) {
        <div class="bg-neutral-900 border border-neutral-700 rounded p-4 mb-6">
          <h2 class="text-neutral-400 text-xs uppercase tracking-wider mb-4">New task</h2>
          <app-task-form
            submitLabel="Create"
            [saving]="service.saving()"
            [contexts]="contexts.items()"
            [projects]="projects.items()"
            (save)="onCreate($event)"
            (cancel)="showCreateForm.set(false)"
          />
        </div>
      }

      <!-- Filter / sort bar -->
      <div class="flex items-center gap-2 mb-6 flex-wrap">
        <!-- Status toggle -->
        <div
          class="flex rounded border border-neutral-700 text-xs"
          role="group"
          aria-label="Filter by status"
        >
          <button
            (click)="setStatusFilter(null)"
            class="px-3 py-1.5 transition-colors rounded-l"
            [class]="
              statusFilter() === null
                ? 'bg-neutral-700 text-neutral-100'
                : 'text-neutral-400 hover:text-neutral-200'
            "
          >
            All
          </button>
          <button
            (click)="setStatusFilter(false)"
            class="px-3 py-1.5 transition-colors border-l border-neutral-700"
            [class]="
              statusFilter() === false
                ? 'bg-neutral-700 text-neutral-100'
                : 'text-neutral-400 hover:text-neutral-200'
            "
          >
            Active
          </button>
          <button
            (click)="setStatusFilter(true)"
            class="px-3 py-1.5 transition-colors border-l border-neutral-700 rounded-r"
            [class]="
              statusFilter() === true
                ? 'bg-neutral-700 text-neutral-100'
                : 'text-neutral-400 hover:text-neutral-200'
            "
          >
            Done
          </button>
        </div>

        <!-- Context filter -->
        @if (contexts.items().length > 0) {
          <select
            [ngModel]="contextFilter()"
            (ngModelChange)="setContextFilter($event)"
            aria-label="Filter by context"
            class="bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-400"
          >
            <option value="">All contexts</option>
            @for (ctx of contexts.items(); track ctx.id) {
              <option [value]="ctx.id">{{ ctx.title }}</option>
            }
          </select>
        }

        <!-- Project filter -->
        @if (projects.items().length > 0) {
          <select
            [ngModel]="projectFilter()"
            (ngModelChange)="setProjectFilter($event)"
            aria-label="Filter by project"
            class="bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-400"
          >
            <option value="">All projects</option>
            @for (proj of projects.items(); track proj.id) {
              <option [value]="proj.id">{{ proj.title }}</option>
            }
          </select>
        }

        <!-- Sort -->
        <app-select
          class="ml-auto"
          size="sm"
          [options]="sortOptions"
          [value]="sortOption()"
          ariaLabel="Sort tasks"
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
        <p class="text-neutral-700 text-sm text-center py-16">No tasks</p>
      }

      @if (service.items().length > 0) {
        <ul aria-label="Tasks">
          @for (task of service.items(); track task.id) {
            <app-task-list-item
              [task]="task"
              [tags]="tagsFor(task)"
              [saving]="service.saving()"
              [isEditing]="editingId() === task.id"
              [contexts]="contexts.items()"
              [projects]="projects.items()"
              (toggleTask)="service.toggleDone($event)"
              (edit)="editingId.set(task.id)"
              (deleteTask)="service.delete($event)"
              (saveEdit)="onUpdate(task.id, $event)"
              (cancelEdit)="editingId.set(null)"
            />
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
export class TasksComponent extends PaginatedListDirective<Task, TasksRequest> {
  readonly contexts = inject(ContextsService);
  readonly projects = inject(ProjectsService);

  readonly statusFilter = signal<boolean | null>(null);
  readonly contextFilter = signal('');
  readonly projectFilter = signal('');
  override readonly sortOption = signal('newest');

  readonly sortOptions: SelectOption[] = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'updated', label: 'Recently updated' },
    { value: 'az', label: 'A → Z' },
    { value: 'za', label: 'Z → A' },
  ];
  protected override readonly service = inject(TasksService);

  private contextMap = computed(() => new Map(this.contexts.items().map((c) => [c.id, c.title])));
  private projectMap = computed(() => new Map(this.projects.items().map((p) => [p.id, p.title])));

  override ngOnInit(): void {
    super.ngOnInit();
    this.contexts.load();
    this.projects.load();
  }

  protected override loadPage(page: number): void {
    const { sortBy, order } = TASK_SORT_MAP[this.sortOption() as TaskSortOption];
    const params: TasksRequest = { page, sortBy, order };
    const done = this.statusFilter();
    if (done !== null) params.done = done;
    const ctx = this.contextFilter();
    if (ctx) params.contextId = ctx;
    const proj = this.projectFilter();
    if (proj) params.projectId = proj;
    this.service.load(params);
  }

  setStatusFilter(value: boolean | null): void {
    this.statusFilter.set(value);
    this.loadPage(1);
  }

  setContextFilter(value: string): void {
    this.contextFilter.set(value);
    this.loadPage(1);
  }

  setProjectFilter(value: string): void {
    this.projectFilter.set(value);
    this.loadPage(1);
  }

  tagsFor(task: Task): string[] {
    const tags: string[] = [];
    if (task.projectId) {
      const name = this.projectMap().get(task.projectId);
      if (name) tags.push(name);
    }
    if (task.contextId) {
      const name = this.contextMap().get(task.contextId);
      if (name) tags.push(name);
    }
    return tags;
  }

  onCreate(payload: TaskPayload): void {
    this.service.create(payload, () => this.showCreateForm.set(false));
  }

  onUpdate(id: string, payload: TaskPayload): void {
    this.service.update(id, payload, () => this.editingId.set(null));
  }
}
