import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Context } from '../../../core/models/context.model';
import { Project } from '../../../core/models/project.model';
import { Task } from '../../../core/models/task.model';
import { TaskFormComponent } from './task-form.component';
import { TaskPayload } from '../services/tasks.service';

@Component({
  selector: 'app-task-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskFormComponent],
  host: {
    class: 'block border-b border-neutral-800 last:border-0',
    '[class.py-3]': '!isEditing()',
    '[class.py-4]': 'isEditing()',
  },
  template: `
    @if (isEditing()) {
      <app-task-form
        [initialDescription]="task().description"
        [initialContextId]="task().contextId"
        [initialProjectId]="task().projectId"
        submitLabel="Save"
        [saving]="saving()"
        [lockContext]="lockContext()"
        [lockProject]="lockProject()"
        [contexts]="contexts()"
        [projects]="projects()"
        (save)="saveEdit.emit($event)"
        (cancel)="cancelEdit.emit()"
      />
    } @else {
      <div class="flex items-start gap-3">
        <button
          (click)="toggleDone.emit()"
          [attr.aria-label]="
            task().done
              ? 'Reopen task: ' + task().description
              : 'Complete task: ' + task().description
          "
          class="mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors"
          [class]="
            task().done
              ? 'bg-neutral-100 border-neutral-100'
              : 'border-neutral-600 hover:border-neutral-400'
          "
        >
          @if (task().done) {
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
            [class]="task().done ? 'text-neutral-600 line-through' : 'text-neutral-100'"
          >
            {{ task().description }}
          </p>
          @if (tags().length > 0) {
            <div class="flex gap-3 flex-wrap mt-1">
              @for (tag of tags(); track tag) {
                <span class="text-xs text-neutral-600">{{ tag }}</span>
              }
            </div>
          }
          <div
            class="flex gap-4 mt-3"
            role="group"
            [attr.aria-label]="'Actions for ' + task().description"
          >
            <button
              (click)="edit.emit()"
              class="text-xs text-neutral-400 hover:text-neutral-100 transition-colors"
            >
              Edit
            </button>
            <button
              (click)="delete.emit()"
              class="text-xs text-neutral-600 hover:text-red-400 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class TaskListItemComponent {
  task = input.required<Task>();
  tags = input<string[]>([]);
  saving = input(false);
  contexts = input<Context[]>([]);
  projects = input<Project[]>([]);
  lockContext = input(false);
  lockProject = input(false);
  isEditing = input(false);

  toggleDone = output<void>();
  edit = output<void>();
  delete = output<void>();
  saveEdit = output<TaskPayload>();
  cancelEdit = output<void>();
}
