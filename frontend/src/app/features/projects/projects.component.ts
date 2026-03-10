import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ProjectsService } from './projects.service';
import { ListItemComponent } from '../../shared/list-item/list-item.component';
import { ProjectFormComponent } from './project-form.component';

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ListItemComponent, ProjectFormComponent],
  template: `
    <div class="max-w-2xl mx-auto px-6 py-10">

      <div class="flex items-baseline justify-between mb-8">
        <div class="flex items-baseline gap-3">
          <h1 class="text-neutral-100 text-lg font-medium">Projects</h1>
          @if (projects.items().length > 0) {
            <span class="text-neutral-600 text-sm">{{ projects.items().length }}</span>
          }
        </div>
        @if (!showCreateForm()) {
          <button
            (click)="showCreateForm.set(true)"
            class="bg-neutral-100 text-neutral-900 text-sm px-4 py-2 rounded hover:bg-white transition-colors"
          >New project</button>
        }
      </div>

      @if (showCreateForm()) {
        <div class="bg-neutral-900 border border-neutral-700 rounded p-4 mb-8">
          <h2 class="text-neutral-400 text-xs uppercase tracking-wider mb-4">New project</h2>
          <app-project-form
            submitLabel="Create"
            [saving]="projects.saving()"
            (save)="onCreate($event)"
            (cancel)="showCreateForm.set(false)"
          />
        </div>
      }

      @if (projects.error()) {
        <p class="text-red-400 text-sm mb-4" role="alert">{{ projects.error() }}</p>
      }

      @if (projects.loading()) {
        <p class="text-neutral-600 text-sm" aria-live="polite">Loading...</p>
      }

      @if (!projects.loading() && projects.items().length === 0) {
        <p class="text-neutral-700 text-sm text-center py-16">No projects</p>
      }

      @if (projects.items().length > 0) {
        <ul aria-label="Projects">
          @for (project of projects.items(); track project.id) {
            @if (editingId() === project.id) {
              <li class="py-4 border-b border-neutral-800 last:border-0">
                <app-project-form
                  [initialTitle]="project.title"
                  submitLabel="Save"
                  [saving]="projects.saving()"
                  (save)="onUpdate(project.id, $event)"
                  (cancel)="editingId.set(null)"
                />
              </li>
            } @else {
              <app-list-item
                [title]="project.title"
                [titleLink]="['/projects', project.id]"
                (edit)="editingId.set(project.id)"
                (delete)="projects.delete(project.id)"
              />
            }
          }
        </ul>
      }

    </div>
  `,
})
export class ProjectsComponent implements OnInit {
  projects = inject(ProjectsService);
  showCreateForm = signal(false);
  editingId = signal<string | null>(null);

  ngOnInit(): void {
    this.projects.load();
  }

  onCreate(title: string): void {
    this.projects.create(title, () => this.showCreateForm.set(false));
  }

  onUpdate(id: string, title: string): void {
    this.projects.update(id, title, () => this.editingId.set(null));
  }
}
