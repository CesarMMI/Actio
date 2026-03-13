import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, signal } from '@angular/core';
import { Subject, switchMap } from 'rxjs';
import { IPaginationService } from '../interfaces/pagination.service.interface';
import { PaginationRequest, PaginationResponse } from '../types/pagination.api';

export abstract class PaginationService<
  T,
  P extends PaginationRequest = PaginationRequest,
> implements IPaginationService<T, P> {
  protected readonly http = inject(HttpClient);
  protected abstract readonly apiUrl: string;
  protected abstract readonly entityName: string;

  readonly items = signal<T[]>([]);
  readonly page = signal(1);
  readonly limit = signal(20);
  readonly total = signal(0);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.limit())));
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private readonly loadTrigger$ = new Subject<HttpParams>();

  constructor() {
    this.loadTrigger$
      .pipe(switchMap((params) => this.http.get<PaginationResponse<T>>(this.apiUrl, { params })))
      .subscribe({
        next: (data) => {
          this.items.set(data.items);
          this.total.set(data.total);
          this.page.set(data.page);
          this.limit.set(data.limit);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(`Failed to load ${this.entityName}`);
          this.loading.set(false);
        },
      });
  }

  load(params: P = {} as P): void {
    this.loading.set(true);
    this.error.set(null);
    this.loadTrigger$.next(this.buildParams(params));
  }

  protected buildParams(obj: PaginationRequest): HttpParams {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined) continue;
      params = params.set(key, String(value));
    }
    return params;
  }
}
