import { signal } from '@angular/core';
import { Subject, switchMap } from 'rxjs';
import { PaginationRequest } from '../types/pagination.api';
import { PaginationService } from './pagination.service';

export abstract class CrudPaginationService<
  T extends { id: string; title: string },
  P extends PaginationRequest = PaginationRequest,
> extends PaginationService<T, P> {
  readonly saving = signal(false);
  readonly current = signal<T | null>(null);
  readonly detailLoading = signal(false);
  readonly detailError = signal<string | null>(null);

  private readonly loadOneTrigger$ = new Subject<string>();

  constructor() {
    super();
    this.loadOneTrigger$
      .pipe(switchMap((id) => this.http.get<T>(`${this.apiUrl}/${id}`)))
      .subscribe({
        next: (entity) => {
          this.current.set(entity);
          this.detailLoading.set(false);
        },
        error: () => {
          this.detailError.set(`Failed to load ${this.entityName}`);
          this.detailLoading.set(false);
        },
      });
  }

  loadOne(id: string): void {
    this.detailLoading.set(true);
    this.detailError.set(null);
    this.loadOneTrigger$.next(id);
  }

  create(title: string, onSuccess: () => void): void {
    this.saving.set(true);
    this.error.set(null);
    this.http.post<T>(this.apiUrl, { title }).subscribe({
      next: (entity) => {
        this.items.update((items) => [...items, entity]);
        this.total.update((t) => t + 1);
        this.saving.set(false);
        onSuccess();
      },
      error: () => {
        this.error.set(`Failed to create ${this.entityName}`);
        this.saving.set(false);
      },
    });
  }

  update(id: string, title: string, onSuccess: () => void): void {
    this.saving.set(true);
    this.detailError.set(null);
    this.http.patch<T>(`${this.apiUrl}/${id}`, { title }).subscribe({
      next: (entity) => {
        this.current.set(entity);
        this.items.update((items) => items.map((e) => (e.id === id ? entity : e)));
        this.saving.set(false);
        onSuccess();
      },
      error: () => {
        this.detailError.set(`Failed to update ${this.entityName}`);
        this.saving.set(false);
      },
    });
  }

  delete(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.items.update((items) => items.filter((e) => e.id !== id));
        this.total.update((t) => Math.max(0, t - 1));
      },
      error: () => this.error.set(`Failed to delete ${this.entityName}`),
    });
  }
}
