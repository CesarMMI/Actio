import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Context } from '../../../core/models/context.model';
import { PaginatedResult } from '../../../core/models/paginated-result.model';
import { environment } from '../../../../environments/environment';

export interface ContextListParams {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  order?: 'asc' | 'desc';
}

function buildParams(obj: Record<string, string | number | boolean | undefined>): HttpParams {
  let params = new HttpParams();
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) params = params.set(key, String(value));
  }
  return params;
}

@Injectable({ providedIn: 'root' })
export class ContextsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/contexts`;

  items = signal<Context[]>([]);
  total = signal(0);
  page = signal(1);
  limit = signal(20);
  loading = signal(false);
  error = signal<string | null>(null);

  saving = signal(false);

  current = signal<Context | null>(null);
  detailLoading = signal(false);
  detailError = signal<string | null>(null);

  load(params: ContextListParams = {}): void {
    this.loading.set(true);
    this.error.set(null);
    this.http
      .get<PaginatedResult<Context>>(this.apiUrl, { params: buildParams(params as Record<string, string | number | undefined>) })
      .subscribe({
        next: (data) => {
          this.items.set(data.items);
          this.total.set(data.total);
          this.page.set(data.page);
          this.limit.set(data.limit);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load contexts');
          this.loading.set(false);
        },
      });
  }

  loadOne(id: string): void {
    this.detailLoading.set(true);
    this.detailError.set(null);
    this.http.get<Context>(`${this.apiUrl}/${id}`).subscribe({
      next: (context) => {
        this.current.set(context);
        this.detailLoading.set(false);
      },
      error: () => {
        this.detailError.set('Failed to load context');
        this.detailLoading.set(false);
      },
    });
  }

  create(title: string, onSuccess: () => void): void {
    this.saving.set(true);
    this.error.set(null);
    this.http.post<Context>(this.apiUrl, { title }).subscribe({
      next: (context) => {
        this.items.update((items) => [...items, context]);
        this.total.update((t) => t + 1);
        this.saving.set(false);
        onSuccess();
      },
      error: () => {
        this.error.set('Failed to create context');
        this.saving.set(false);
      },
    });
  }

  update(id: string, title: string, onSuccess: () => void): void {
    this.saving.set(true);
    this.detailError.set(null);
    this.http.patch<Context>(`${this.apiUrl}/${id}`, { title }).subscribe({
      next: (context) => {
        this.current.set(context);
        this.items.update((items) => items.map((c) => (c.id === id ? context : c)));
        this.saving.set(false);
        onSuccess();
      },
      error: () => {
        this.detailError.set('Failed to update context');
        this.saving.set(false);
      },
    });
  }

  delete(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.items.update((items) => items.filter((c) => c.id !== id));
        this.total.update((t) => Math.max(0, t - 1));
      },
      error: () => this.error.set('Failed to delete context'),
    });
  }
}
