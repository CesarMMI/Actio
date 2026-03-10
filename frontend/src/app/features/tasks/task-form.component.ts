import { ChangeDetectionStrategy, Component, computed, input, OnInit, output, signal } from '@angular/core';
import { Context } from '../../core/models/context.model';
import { Project } from '../../core/models/project.model';
import { TaskPayload } from './tasks.service';

@Component({
  selector: 'app-task-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form (submit)="submit($event)" class="flex flex-col gap-3">

      <div>
        <label for="task-description" class="sr-only">Task description</label>
        <input
          id="task-description"
          type="text"
          [value]="description()"
          (input)="description.set($any($event.target).value)"
          placeholder="Task description"
          autocomplete="off"
          class="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-100 text-sm placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-400"
        />
        @if (showError()) {
          <p class="text-red-400 text-xs mt-1" role="alert">Description is required.</p>
        }
      </div>

      <div class="flex gap-3">
        <div class="flex-1">
          <label for="task-project" class="block text-neutral-500 text-xs mb-1">Project</label>
          <select
            id="task-project"
            [value]="projectId()"
            (change)="projectId.set($any($event.target).value || null)"
            class="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
          >
            <option value="">No project</option>
            @for (p of projects(); track p.id) {
              <option [value]="p.id">{{ p.title }}</option>
            }
          </select>
        </div>

        <div class="flex-1">
          <label for="task-context" class="block text-neutral-500 text-xs mb-1">Context</label>
          <select
            id="task-context"
            [value]="contextId()"
            (change)="contextId.set($any($event.target).value || null)"
            class="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
          >
            <option value="">No context</option>
            @for (c of contexts(); track c.id) {
              <option [value]="c.id">{{ c.title }}</option>
            }
          </select>
        </div>
      </div>

      <div class="flex gap-2">
        <button
          type="submit"
          [disabled]="saving()"
          class="bg-neutral-100 text-neutral-900 text-sm px-4 py-2 rounded hover:bg-white transition-colors disabled:opacity-50"
        >{{ saving() ? 'Saving…' : submitLabel() }}</button>

        <button
          type="button"
          (click)="cancel.emit()"
          class="border border-neutral-700 text-neutral-300 text-sm px-4 py-2 rounded hover:bg-neutral-800 transition-colors"
        >Cancel</button>
      </div>

    </form>
  `,
})
export class TaskFormComponent implements OnInit {
  initialDescription = input('');
  initialContextId = input<string | null>(null);
  initialProjectId = input<string | null>(null);
  contexts = input<Context[]>([]);
  projects = input<Project[]>([]);
  saving = input(false);
  submitLabel = input('Save');

  save = output<TaskPayload>();
  cancel = output<void>();

  description = signal('');
  contextId = signal<string | null>(null);
  projectId = signal<string | null>(null);
  touched = signal(false);
  showError = computed(() => this.touched() && this.description().trim().length === 0);

  ngOnInit(): void {
    this.description.set(this.initialDescription());
    this.contextId.set(this.initialContextId());
    this.projectId.set(this.initialProjectId());
  }

  submit(event: SubmitEvent): void {
    event.preventDefault();
    this.touched.set(true);
    if (this.description().trim().length === 0) return;
    this.save.emit({
      description: this.description().trim(),
      contextId: this.contextId(),
      projectId: this.projectId(),
    });
  }
}
