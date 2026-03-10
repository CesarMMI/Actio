import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { TasksService, TaskPayload } from './tasks.service';
import { TaskFormComponent } from './task-form.component';
import { ListItemComponent } from '../../shared/list-item/list-item.component';
import { ProjectsService } from '../projects/projects.service';
import { ContextsService } from '../contexts/contexts.service';

@Component({
  selector: 'app-tasks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskFormComponent, ListItemComponent],
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
          >New task</button>
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
              <app-list-item
                [title]="task.description"
                [tags]="tagsFor(task.id)"
                (edit)="editingId.set(task.id)"
                (delete)="tasks.delete(task.id)"
              />
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

  private contextMap = computed(() =>
    new Map(this.contexts.items().map((c) => [c.id, c.title]))
  );

  private projectMap = computed(() =>
    new Map(this.projects.items().map((p) => [p.id, p.title]))
  );

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
}
