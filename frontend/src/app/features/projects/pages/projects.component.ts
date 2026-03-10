import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ProjectsService, ProjectListParams } from '../services/projects.service';
import { ListItemComponent } from '../../../shared/components/list-item/list-item.component';
import { ProjectFormComponent } from '../components/project-form.component';
import { FormsModule } from '@angular/forms';

type ProjectSortOption = 'title-asc' | 'title-desc' | 'newest' | 'oldest';

const PROJECT_SORT_MAP: Record<ProjectSortOption, { sortBy: ProjectListParams['sortBy']; order: ProjectListParams['order'] }> = {
  'title-asc':  { sortBy: 'title',     order: 'asc'  },
  'title-desc': { sortBy: 'title',     order: 'desc' },
  newest:       { sortBy: 'createdAt', order: 'desc' },
  oldest:       { sortBy: 'createdAt', order: 'asc'  },
};

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ListItemComponent, ProjectFormComponent, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto px-6 py-10">
      <div class="flex items-baseline justify-between mb-6">
        <div class="flex items-baseline gap-3">
          <h1 class="text-neutral-100 text-lg font-medium">Projects</h1>
          @if (projects.total() > 0) {
            <span class="text-neutral-600 text-sm">{{ projects.total() }}</span>
          }
        </div>
        @if (!showCreateForm()) {
          <button
            (click)="showCreateForm.set(true)"
            class="bg-neutral-100 text-neutral-900 text-sm px-4 py-2 rounded hover:bg-white transition-colors"
          >
            New project
          </button>
        }
      </div>

      @if (showCreateForm()) {
        <div class="bg-neutral-900 border border-neutral-700 rounded p-4 mb-6">
          <h2 class="text-neutral-400 text-xs uppercase tracking-wider mb-4">New project</h2>
          <app-project-form
            submitLabel="Create"
            [saving]="projects.saving()"
            (save)="onCreate($event)"
            (cancel)="showCreateForm.set(false)"
          />
        </div>
      }

      <!-- Sort bar -->
      <div class="flex items-center justify-end mb-6">
        <select
          [ngModel]="sortOption()"
          (ngModelChange)="setSortOption($event)"
          aria-label="Sort projects"
          class="bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-400"
        >
          <option value="title-asc">Title A → Z</option>
          <option value="title-desc">Title Z → A</option>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

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

        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="flex items-center justify-between mt-6 pt-4 border-t border-neutral-800">
            <button
              (click)="prevPage()"
              [disabled]="projects.page() === 1"
              class="text-xs text-neutral-400 hover:text-neutral-100 disabled:text-neutral-700 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            <span class="text-xs text-neutral-600">
              Page {{ projects.page() }} of {{ totalPages() }}
            </span>
            <button
              (click)="nextPage()"
              [disabled]="projects.page() === totalPages()"
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
export class ProjectsComponent implements OnInit {
  projects = inject(ProjectsService);
  showCreateForm = signal(false);
  editingId = signal<string | null>(null);
  sortOption = signal<ProjectSortOption>('title-asc');

  totalPages = computed(() => Math.max(1, Math.ceil(this.projects.total() / this.projects.limit())));

  ngOnInit(): void {
    this.load();
  }

  private load(page = 1): void {
    const { sortBy, order } = PROJECT_SORT_MAP[this.sortOption()];
    this.projects.load({ page, sortBy, order });
  }

  setSortOption(value: ProjectSortOption): void {
    this.sortOption.set(value);
    this.load(1);
  }

  prevPage(): void {
    const p = this.projects.page();
    if (p > 1) this.load(p - 1);
  }

  nextPage(): void {
    const p = this.projects.page();
    if (p < this.totalPages()) this.load(p + 1);
  }

  onCreate(title: string): void {
    this.projects.create(title, () => this.showCreateForm.set(false));
  }

  onUpdate(id: string, title: string): void {
    this.projects.update(id, title, () => this.editingId.set(null));
  }
}
