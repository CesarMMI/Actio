import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Context } from '../../../core/models/context.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContextsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/contexts`;

  items = signal<Context[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  saving = signal(false);

  current = signal<Context | null>(null);
  detailLoading = signal(false);
  detailError = signal<string | null>(null);

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<Context[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.items.set(data);
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
      next: () => this.items.update((items) => items.filter((c) => c.id !== id)),
      error: () => this.error.set('Failed to delete context'),
    });
  }
}
