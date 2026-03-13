import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { Context } from '../../../core/models/context.model';
import { Project } from '../../../core/models/project.model';
import { SelectComponent } from '../../../shared/select/components/select.component';
import { SelectOption } from '../../../shared/select/types/select-option';
import { TaskPayload } from '../services/tasks.service';

@Component({
  selector: 'app-task-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectComponent],
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
          <p class="block text-neutral-500 text-xs mb-1">Project</p>
          @if (lockProject()) {
            <div class="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-400 text-sm">
              {{ lockedProjectName() ?? 'No project' }}
            </div>
          } @else {
            <app-select
              placeholder="No project"
              [options]="projectOptions()"
              [value]="projectId() ?? ''"
              ariaLabel="Project"
              (valueChange)="projectId.set($event || null)"
            />
          }
        </div>

        <div class="flex-1">
          <p class="block text-neutral-500 text-xs mb-1">Context</p>
          @if (lockContext()) {
            <div class="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-400 text-sm">
              {{ lockedContextName() ?? 'No context' }}
            </div>
          } @else {
            <app-select
              placeholder="No context"
              [options]="contextOptions()"
              [value]="contextId() ?? ''"
              ariaLabel="Context"
              (valueChange)="contextId.set($event || null)"
            />
          }
        </div>
      </div>

      <div class="flex gap-2">
        <button
          type="submit"
          [disabled]="saving()"
          class="bg-neutral-100 text-neutral-900 text-sm px-4 py-2 rounded hover:bg-white transition-colors disabled:opacity-50"
        >
          {{ saving() ? 'Saving…' : submitLabel() }}
        </button>

        <button
          type="button"
          (click)="cancel.emit()"
          class="border border-neutral-700 text-neutral-300 text-sm px-4 py-2 rounded hover:bg-neutral-800 transition-colors"
        >
          Cancel
        </button>
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
  lockContext = input(false);
  lockProject = input(false);
  saving = input(false);
  submitLabel = input('Save');

  save = output<TaskPayload>();
  cancel = output<void>();

  description = signal('');
  contextId = signal<string | null>(null);
  projectId = signal<string | null>(null);
  touched = signal(false);
  showError = computed(() => this.touched() && this.description().trim().length === 0);

  projectOptions = computed<SelectOption[]>(() =>
    this.projects().map((p) => ({ value: p.id, label: p.title })),
  );

  contextOptions = computed<SelectOption[]>(() =>
    this.contexts().map((c) => ({ value: c.id, label: c.title })),
  );

  lockedProjectName = computed(() =>
    this.projects().find((p) => p.id === this.projectId())?.title ?? null,
  );

  lockedContextName = computed(() =>
    this.contexts().find((c) => c.id === this.contextId())?.title ?? null,
  );

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
