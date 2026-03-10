import { ChangeDetectionStrategy, Component, computed, input, OnInit, output, signal } from '@angular/core';

@Component({
  selector: 'app-project-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form (submit)="submit($event)" class="flex flex-col gap-3">
      <div>
        <label for="project-title" class="sr-only">Project title</label>
        <input
          id="project-title"
          type="text"
          [value]="title()"
          (input)="title.set($any($event.target).value)"
          placeholder="Project title"
          autocomplete="off"
          class="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-100 text-sm placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-400"
        />
        @if (showError()) {
          <p class="text-red-400 text-xs mt-1" role="alert">Title is required.</p>
        }
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
export class ProjectFormComponent implements OnInit {
  initialTitle = input('');
  saving = input(false);
  submitLabel = input('Save');

  save = output<string>();
  cancel = output<void>();

  title = signal('');
  touched = signal(false);
  showError = computed(() => this.touched() && this.title().trim().length === 0);

  ngOnInit(): void {
    this.title.set(this.initialTitle());
  }

  submit(event: SubmitEvent): void {
    event.preventDefault();
    this.touched.set(true);
    if (this.title().trim().length === 0) return;
    this.save.emit(this.title().trim());
  }
}
