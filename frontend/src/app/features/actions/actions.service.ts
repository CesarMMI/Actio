import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Action } from '../../core/models/action.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ActionsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/actions`;

  items = signal<Action[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<Action[]>(this.apiUrl, { params: { status: 'OPEN' } }).subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load actions');
        this.loading.set(false);
      },
    });
  }

  complete(id: string): void {
    this.http.post<void>(`${this.apiUrl}/${id}/complete`, {}).subscribe({
      next: () => this.items.update((items) => items.filter((a) => a.id !== id)),
      error: () => this.error.set('Failed to complete action'),
    });
  }

  archive(id: string): void {
    this.http.post<void>(`${this.apiUrl}/${id}/archive`, {}).subscribe({
      next: () => this.items.update((items) => items.filter((a) => a.id !== id)),
      error: () => this.error.set('Failed to archive action'),
    });
  }
}
