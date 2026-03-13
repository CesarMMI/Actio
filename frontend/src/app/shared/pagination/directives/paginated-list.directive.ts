import { Directive, OnInit, signal } from '@angular/core';
import { IPaginationService } from '../interfaces/pagination.service.interface';
import { PaginationRequest } from '../types/pagination.api';

@Directive()
export abstract class PaginatedListDirective<T, P extends PaginationRequest = PaginationRequest>
  implements OnInit
{
  protected abstract readonly service: IPaginationService<T, P>;

  readonly sortOption = signal('title-asc');
  readonly showCreateForm = signal(false);
  readonly editingId = signal<string | null>(null);

  protected abstract loadPage(page: number): void;

  ngOnInit(): void {
    this.loadPage(1);
  }

  setSortOption(value: string): void {
    this.sortOption.set(value);
    this.loadPage(1);
  }

  prevPage(): void {
    const p = this.service.page();
    if (p > 1) this.loadPage(p - 1);
  }

  nextPage(): void {
    const p = this.service.page();
    if (p < this.service.totalPages()) this.loadPage(p + 1);
  }
}
