import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'app-project-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SlicePipe],
  template: `
    <div class="max-w-2xl mx-auto px-6 py-10">

      <!-- Back -->
      <a routerLink="/projects" class="text-neutral-600 text-xs hover:text-neutral-400 transition-colors mb-8 inline-block">
        &larr; Projects
      </a>

      <!-- Error -->
      @if (projects.detailError()) {
        <p class="text-red-400 text-sm mb-4" role="alert">{{ projects.detailError() }}</p>
      }

      <!-- Loading -->
      @if (projects.detailLoading()) {
        <p class="text-neutral-600 text-sm" aria-live="polite">Loading...</p>
      }

      @if (projects.current()) {
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-neutral-100 text-lg font-medium">{{ projects.current()!.name }}</h1>
          @if (projects.current()!.description) {
            <p class="text-neutral-500 text-sm mt-1">{{ projects.current()!.description }}</p>
          }
        </div>

        <!-- Actions -->
        <div>
          <h2 class="text-neutral-500 text-xs uppercase tracking-wider mb-4">Actions</h2>

          @if (projects.currentActions().length === 0) {
            <p class="text-neutral-700 text-sm text-center py-12">No actions in this project</p>
          } @else {
            <ul aria-label="Project actions">
              @for (action of projects.currentActions(); track action.id) {
                <li class="py-3 border-b border-neutral-800 last:border-0">
                  <p class="text-neutral-100 text-sm mb-1">{{ action.title }}</p>
                  @if (action.notes) {
                    <p class="text-neutral-500 text-xs mb-1">{{ action.notes }}</p>
                  }
                  <div class="flex gap-3 flex-wrap">
                    @if (action.timeBucket) {
                      <span class="text-xs text-neutral-600">{{ action.timeBucket }}</span>
                    }
                    @if (action.energyLevel) {
                      <span class="text-xs text-neutral-600">{{ action.energyLevel }}</span>
                    }
                    @if (action.dueDate) {
                      <span class="text-xs text-neutral-600">due {{ action.dueDate | slice:0:10 }}</span>
                    }
                    <span class="text-xs text-neutral-700">{{ action.status }}</span>
                  </div>
                </li>
              }
            </ul>
          }
        </div>
      }

    </div>
  `,
})
export class ProjectDetailComponent implements OnInit {
  projects = inject(ProjectsService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.projects.loadOne(id);
  }
}
