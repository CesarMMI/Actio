import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ContextsService } from './contexts.service';
import { ContextFormComponent } from './context-form.component';

@Component({
  selector: 'app-context-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ContextFormComponent],
  template: `
    <div class="max-w-2xl mx-auto px-6 py-10">

      <a routerLink="/contexts" class="text-neutral-600 text-xs hover:text-neutral-400 transition-colors mb-8 inline-block">
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
            >Edit</button>
          </div>
        }
      }

    </div>
  `,
})
export class ContextDetailComponent implements OnInit {
  contexts = inject(ContextsService);
  editing = signal(false);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.contexts.loadOne(id);
  }

  onUpdate(title: string): void {
    const id = this.contexts.current()!.id;
    this.contexts.update(id, title, () => this.editing.set(false));
  }
}
