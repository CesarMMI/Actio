import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TasksService, TaskPayload, TaskListParams } from '../services/tasks.service';
import { TaskFormComponent } from '../components/task-form.component';
import { ProjectsService } from '../../projects/services/projects.service';
import { ContextsService } from '../../contexts/services/contexts.service';
import { Task } from '../../../core/models/task.model';
import { FormsModule } from '@angular/forms';

type TaskSortOption = 'newest' | 'oldest' | 'az' | 'za' | 'updated';

const TASK_SORT_MAP: Record<TaskSortOption, { sortBy: TaskListParams['sortBy']; order: TaskListParams['order'] }> = {
  newest:  { sortBy: 'createdAt',   order: 'desc' },
  oldest:  { sortBy: 'createdAt',   order: 'asc'  },
  az:      { sortBy: 'description', order: 'asc'  },
  za:      { sortBy: 'description', order: 'desc' },
  updated: { sortBy: 'updatedAt',   order: 'desc' },
};

@Component({
  selector: 'app-tasks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskFormComponent, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto px-6 py-10">
      <div class="flex items-baseline justify-between mb-6">
        <div class="flex items-baseline gap-3">
          <h1 class="text-neutral-100 text-lg font-medium">Tasks</h1>
          @if (tasks.total() > 0) {
            <span class="text-neutral-600 text-sm">{{ tasks.total() }}</span>
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
            [saving]="tasks.saving()"
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
        <div class="flex rounded border border-neutral-700 text-xs" role="group" aria-label="Filter by status">
          <button
            (click)="setStatusFilter(null)"
            class="px-3 py-1.5 transition-colors rounded-l"
            [class]="statusFilter() === null ? 'bg-neutral-700 text-neutral-100' : 'text-neutral-400 hover:text-neutral-200'"
          >All</button>
          <button
            (click)="setStatusFilter(false)"
            class="px-3 py-1.5 transition-colors border-l border-neutral-700"
            [class]="statusFilter() === false ? 'bg-neutral-700 text-neutral-100' : 'text-neutral-400 hover:text-neutral-200'"
          >Active</button>
          <button
            (click)="setStatusFilter(true)"
            class="px-3 py-1.5 transition-colors border-l border-neutral-700 rounded-r"
            [class]="statusFilter() === true ? 'bg-neutral-700 text-neutral-100' : 'text-neutral-400 hover:text-neutral-200'"
          >Done</button>
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
        <select
          [ngModel]="sortOption()"
          (ngModelChange)="setSortOption($event)"
          aria-label="Sort tasks"
          class="bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-400 ml-auto"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="updated">Recently updated</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
        </select>
      </div>

      @if (tasks.error()) {
        <p class="text-red-400 text-sm mb-4" role="alert">{{ tasks.error() }}</p>
      }

      @if (tasks.loading()) {
        <p class="text-neutral-600 text-sm" aria-live="polite">Loading...</p>
      }

      @if (!tasks.loading() && tasks.items().length === 0) {
        <p class="text-neutral-700 text-sm text-center py-16">No tasks</p>
      }

      @if (tasks.items().length > 0) {
        <ul aria-label="Tasks">
          @for (task of tasks.items(); track task.id) {
            @if (editingId() === task.id) {
              <li class="py-4 border-b border-neutral-800 last:border-0">
                <app-task-form
                  [initialDescription]="task.description"
                  [initialContextId]="task.contextId"
                  [initialProjectId]="task.projectId"
                  submitLabel="Save"
                  [saving]="tasks.saving()"
                  [contexts]="contexts.items()"
                  [projects]="projects.items()"
                  (save)="onUpdate(task.id, $event)"
                  (cancel)="editingId.set(null)"
                />
              </li>
            } @else {
              <li class="py-4 border-b border-neutral-800 last:border-0">
                <div class="flex items-start gap-3">
                  <button
                    (click)="onToggleDone(task)"
                    [attr.aria-label]="
                      task.done
                        ? 'Reopen task: ' + task.description
                        : 'Complete task: ' + task.description
                    "
                    class="mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors"
                    [class]="
                      task.done
                        ? 'bg-neutral-100 border-neutral-100'
                        : 'border-neutral-600 hover:border-neutral-400'
                    "
                  >
                    @if (task.done) {
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3 h-3 text-neutral-900"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    }
                  </button>
                  <div class="flex-1 min-w-0">
                    <p
                      class="text-sm"
                      [class]="task.done ? 'text-neutral-600 line-through' : 'text-neutral-100'"
                    >
                      {{ task.description }}
                    </p>
                    @if (tagsFor(task.id).length > 0) {
                      <div class="flex gap-3 flex-wrap mt-2">
                        @for (tag of tagsFor(task.id); track tag) {
                          <span class="text-xs text-neutral-600">{{ tag }}</span>
                        }
                      </div>
                    }
                    <div
                      class="flex gap-4 mt-3"
                      role="group"
                      [attr.aria-label]="'Actions for ' + task.description"
                    >
                      <button
                        (click)="editingId.set(task.id)"
                        class="text-xs text-neutral-400 hover:text-neutral-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        (click)="tasks.delete(task.id)"
                        class="text-xs text-neutral-600 hover:text-red-400 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            }
          }
        </ul>

        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="flex items-center justify-between mt-6 pt-4 border-t border-neutral-800">
            <button
              (click)="prevPage()"
              [disabled]="tasks.page() === 1"
              class="text-xs text-neutral-400 hover:text-neutral-100 disabled:text-neutral-700 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            <span class="text-xs text-neutral-600">
              Page {{ tasks.page() }} of {{ totalPages() }}
            </span>
            <button
              (click)="nextPage()"
              [disabled]="tasks.page() === totalPages()"
              class="text-xs text-neutral-400 hover:text-neutral-100 disabled:text-neutral-700 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        }
      }
    </div>
  `,
})
export class TasksComponent implements OnInit {
  tasks = inject(TasksService);
  contexts = inject(ContextsService);
  projects = inject(ProjectsService);

  showCreateForm = signal(false);
  editingId = signal<string | null>(null);

  statusFilter = signal<boolean | null>(null);
  contextFilter = signal('');
  projectFilter = signal('');
  sortOption = signal<TaskSortOption>('newest');

  private contextMap = computed(() => new Map(this.contexts.items().map((c) => [c.id, c.title])));
  private projectMap = computed(() => new Map(this.projects.items().map((p) => [p.id, p.title])));

  totalPages = computed(() => Math.max(1, Math.ceil(this.tasks.total() / this.tasks.limit())));

  ngOnInit(): void {
    this.load();
    this.contexts.load();
    this.projects.load();
  }

  private load(page = 1): void {
    const { sortBy, order } = TASK_SORT_MAP[this.sortOption()];
    const params: TaskListParams = { page, sortBy, order };
    const done = this.statusFilter();
    if (done !== null) params.done = done;
    const ctx = this.contextFilter();
    if (ctx) params.contextId = ctx;
    const proj = this.projectFilter();
    if (proj) params.projectId = proj;
    this.tasks.load(params);
  }

  setStatusFilter(value: boolean | null): void {
    this.statusFilter.set(value);
    this.load(1);
  }

  setContextFilter(value: string): void {
    this.contextFilter.set(value);
    this.load(1);
  }

  setProjectFilter(value: string): void {
    this.projectFilter.set(value);
    this.load(1);
  }

  setSortOption(value: TaskSortOption): void {
    this.sortOption.set(value);
    this.load(1);
  }

  prevPage(): void {
    const p = this.tasks.page();
    if (p > 1) this.load(p - 1);
  }

  nextPage(): void {
    const p = this.tasks.page();
    if (p < this.totalPages()) this.load(p + 1);
  }

  tagsFor(taskId: string): string[] {
    const task = this.tasks.items().find((t) => t.id === taskId);
    if (!task) return [];
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
    this.tasks.create(payload, () => this.showCreateForm.set(false));
  }

  onUpdate(id: string, payload: TaskPayload): void {
    this.tasks.update(id, payload, () => this.editingId.set(null));
  }

  onToggleDone(task: Task): void {
    if (task.done) {
      this.tasks.reopen(task.id);
    } else {
      this.tasks.complete(task.id);
    }
  }
}
