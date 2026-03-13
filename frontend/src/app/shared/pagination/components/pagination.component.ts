import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (totalPages() > 1) {
      <div
        class="flex items-center justify-between mt-6 pt-4 border-t border-neutral-800"
        role="navigation"
        aria-label="Pagination"
      >
        <button
          (click)="prev.emit()"
          [disabled]="page() === 1"
          class="text-xs text-neutral-400 hover:text-neutral-100 disabled:text-neutral-700 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>
        <span class="text-xs text-neutral-600" aria-live="polite">
          Page {{ page() }} of {{ totalPages() }}
        </span>
        <button
          (click)="next.emit()"
          [disabled]="page() === totalPages()"
          class="text-xs text-neutral-400 hover:text-neutral-100 disabled:text-neutral-700 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    }
  `,
})
export class PaginationComponent {
  page = input.required<number>();
  totalPages = input.required<number>();

  prev = output<void>();
  next = output<void>();
}
