import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ProjectsService } from './projects.service';
import { ListItemComponent } from '../../shared/list-item/list-item.component';

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ListItemComponent],
  template: `
    <div class="max-w-2xl mx-auto px-6 py-10">

      <!-- Header -->
      <div class="flex items-baseline gap-3 mb-8">
        <h1 class="text-neutral-100 text-lg font-medium">Projects</h1>
        @if (projects.items().length > 0) {
          <span class="text-neutral-600 text-sm">{{ projects.items().length }}</span>
        }
      </div>

      <!-- Error -->
      @if (projects.error()) {
        <p class="text-red-400 text-sm mb-4" role="alert">{{ projects.error() }}</p>
      }

      <!-- Loading -->
      @if (projects.loading()) {
        <p class="text-neutral-600 text-sm" aria-live="polite">Loading...</p>
      }

      <!-- Empty state -->
      @if (!projects.loading() && projects.items().length === 0) {
        <p class="text-neutral-700 text-sm text-center py-16">No active projects</p>
      }

      <!-- List -->
      @if (projects.items().length > 0) {
        <ul aria-label="Projects">
          @for (project of projects.items(); track project.id) {
            <app-list-item
              [title]="project.name"
              [titleLink]="['/projects', project.id]"
              [subtitle]="project.description"
              (complete)="projects.complete(project.id)"
              (archive)="projects.archive(project.id)"
            />
          }
        </ul>
      }

    </div>
  `,
})
export class ProjectsComponent implements OnInit {
  projects = inject(ProjectsService);

  ngOnInit(): void {
    this.projects.load('ACTIVE');
  }
}
