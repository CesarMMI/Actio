import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { Task } from '../../../core/models/task.model';
import { TaskListItemComponent } from '../../tasks/components/task-list-item.component';
import { ContextFormComponent } from '../components/context-form.component';
import { ProjectsService } from '../../projects/services/projects.service';
import { TaskFormComponent } from '../../tasks/components/task-form.component';
import { TaskPayload, TasksService } from '../../tasks/services/tasks.service';
import { ContextsService } from '../services/contexts.service';

@Component({
  selector: 'app-context-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ContextFormComponent, TaskFormComponent, TaskListItemComponent],
  template: `
    <div class="max-w-2xl mx-auto px-6 py-10">
      <a
        routerLink="/contexts"
        class="text-neutral-600 text-xs hover:text-neutral-400 transition-colors mb-8 inline-block"
      >
        &larr; Contexts
      </a>

      @if (contexts.detailError()) {
        <p class="text-red-400 text-sm mb-4" role="alert">{{ contexts.detailError() }}</p>
      }

      @if (contexts.detailLoading()) {
        <p class="text-neutral-600 text-sm" aria-live="polite">Loading...</p>
      }

      @if (contexts.current()) {
        @if (editing()) {
          <div class="bg-neutral-900 border border-neutral-700 rounded p-4 mb-8">
            <h2 class="text-neutral-400 text-xs uppercase tracking-wider mb-4">Edit context</h2>
            <app-context-form
              [initialTitle]="contexts.current()!.title"
              submitLabel="Save"
              [saving]="contexts.saving()"
              (save)="onUpdate($event)"
              (cancel)="editing.set(false)"
            />
          </div>
        } @else {
          <div class="flex items-start justify-between mb-8">
            <h1 class="text-neutral-100 text-lg font-medium">{{ contexts.current()!.title }}</h1>
            <button
              (click)="editing.set(true)"
              class="border border-neutral-700 text-neutral-300 text-sm px-4 py-2 rounded hover:bg-neutral-800 transition-colors"
            >
              Edit
            </button>
          </div>
        }

        <div class="border-t border-neutral-700 pt-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-neutral-400 text-xs uppercase tracking-wider">
              Tasks
              @if (tasks.total() > 0) {
                <span class="text-neutral-600 normal-case ml-1">{{ tasks.total() }}</span>
              }
            </h2>
            @if (!showCreateForm()) {
              <button
                (click)="showCreateForm.set(true)"
                class="bg-neutral-100 text-neutral-900 text-xs px-3 py-1.5 rounded hover:bg-white transition-colors"
              >
                New task
              </button>
            }
          </div>

          @if (showCreateForm()) {
            <div class="bg-neutral-900 border border-neutral-700 rounded p-4 mb-4">
              <h3 class="text-neutral-400 text-xs uppercase tracking-wider mb-4">New task</h3>
              <app-task-form
                submitLabel="Create"
                [saving]="tasks.saving()"
                [initialContextId]="contextId"
                [lockContext]="true"
                [contexts]="contexts.current() ? [contexts.current()!] : []"
                [projects]="projects.items()"
                (save)="onCreate($event)"
                (cancel)="showCreateForm.set(false)"
              />
            </div>
          }

          @if (tasks.error()) {
            <p class="text-red-400 text-sm" role="alert">{{ tasks.error() }}</p>
          }

          @if (tasks.loading()) {
            <p class="text-neutral-600 text-sm" aria-live="polite">Loading...</p>
          }

          @if (!tasks.loading() && tasks.items().length === 0) {
            <p class="text-neutral-700 text-sm">No tasks in this context.</p>
          }

          @if (tasks.items().length > 0) {
            <ul aria-label="Tasks in this context">
              @for (task of tasks.items(); track task.id) {
                <app-task-list-item
                  [task]="task"
                  [tags]="tagsFor(task)"
                  [saving]="tasks.saving()"
                  [isEditing]="editingTaskId() === task.id"
                  [lockContext]="true"
                  [contexts]="contexts.current() ? [contexts.current()!] : []"
                  [projects]="projects.items()"
                  (toggleTask)="tasks.toggleDone($event)"
                  (edit)="editingTaskId.set(task.id)"
                  (deleteTask)="tasks.delete($event)"
                  (saveEdit)="onTaskUpdate(task.id, $event)"
                  (cancelEdit)="editingTaskId.set(null)"
                />
              }
            </ul>
          }
        </div>
      }
    </div>
  `,
})
export class ContextDetailComponent {
  readonly contexts = inject(ContextsService);
  readonly tasks = inject(TasksService);
  readonly projects = inject(ProjectsService);
  readonly editing = signal(false);
  readonly showCreateForm = signal(false);
  readonly editingTaskId = signal<string | null>(null);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  contextId = '';

  private readonly projectMap = computed(
    () => new Map(this.projects.items().map((p) => [p.id, p.title])),
  );

  constructor() {
    this.route.paramMap
      .pipe(
        map((p) => p.get('id')),
        filter((id): id is string => !!id),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((id) => {
        this.contextId = id;
        this.contexts.loadOne(id);
        this.tasks.load({ contextId: id });
        this.projects.load();
      });
  }

  tagsFor(task: Task): string[] {
    const name = this.projectMap().get(task.projectId ?? '');
    return name ? [name] : [];
  }

  onUpdate(title: string): void {
    const current = this.contexts.current();
    if (!current) return;
    this.contexts.update(current.id, title, () => this.editing.set(false));
  }

  onCreate(payload: TaskPayload): void {
    this.tasks.create({ ...payload, contextId: this.contextId }, () =>
      this.showCreateForm.set(false),
    );
  }

  onTaskUpdate(id: string, payload: TaskPayload): void {
    this.tasks.update(id, payload, () => this.editingTaskId.set(null));
  }
}
