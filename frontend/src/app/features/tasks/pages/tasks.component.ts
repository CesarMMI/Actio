import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TasksService, TaskPayload } from '../services/tasks.service';
import { TaskFormComponent } from '../components/task-form.component';
import { ProjectsService } from '../../projects/services/projects.service';
import { ContextsService } from '../../contexts/services/contexts.service';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-tasks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskFormComponent],
  template: `
    <div class="max-w-2xl mx-auto px-6 py-10">
      <div class="flex items-baseline justify-between mb-8">
        <div class="flex items-baseline gap-3">
          <h1 class="text-neutral-100 text-lg font-medium">Tasks</h1>
          @if (tasks.items().length > 0) {
            <span class="text-neutral-600 text-sm">{{ tasks.items().length }}</span>
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
        <div class="bg-neutral-900 border border-neutral-700 rounded p-4 mb-8">
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

  private contextMap = computed(() => new Map(this.contexts.items().map((c) => [c.id, c.title])));

  private projectMap = computed(() => new Map(this.projects.items().map((p) => [p.id, p.title])));

  ngOnInit(): void {
    this.tasks.load();
    this.contexts.load();
    this.projects.load();
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
