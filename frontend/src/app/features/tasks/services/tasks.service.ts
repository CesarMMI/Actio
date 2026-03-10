import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Task } from '../../../core/models/task.model';
import { PaginatedResult } from '../../../core/models/paginated-result.model';
import { environment } from '../../../../environments/environment';

export interface TaskPayload {
  description: string;
  contextId: string | null;
  projectId: string | null;
}

export interface TaskListParams {
  done?: boolean;
  contextId?: string;
  projectId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'description';
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
export class TasksService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  items = signal<Task[]>([]);
  total = signal(0);
  page = signal(1);
  limit = signal(20);
  loading = signal(false);
  error = signal<string | null>(null);
  saving = signal(false);

  load(params: TaskListParams = {}): void {
    this.loading.set(true);
    this.error.set(null);
    this.http
      .get<PaginatedResult<Task>>(this.apiUrl, { params: buildParams(params as Record<string, string | number | boolean | undefined>) })
      .subscribe({
        next: (data) => {
          this.items.set(data.items);
          this.total.set(data.total);
          this.page.set(data.page);
          this.limit.set(data.limit);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load tasks');
          this.loading.set(false);
        },
      });
  }

  create(payload: TaskPayload, onSuccess: () => void): void {
    this.saving.set(true);
    this.error.set(null);
    this.http.post<Task>(this.apiUrl, payload).subscribe({
      next: (task) => {
        this.items.update((items) => [...items, task]);
        this.total.update((t) => t + 1);
        this.saving.set(false);
        onSuccess();
      },
      error: () => {
        this.error.set('Failed to create task');
        this.saving.set(false);
      },
    });
  }

  update(id: string, payload: Partial<TaskPayload>, onSuccess: () => void): void {
    this.saving.set(true);
    this.error.set(null);
    this.http.patch<Task>(`${this.apiUrl}/${id}`, payload).subscribe({
      next: (task) => {
        this.items.update((items) => items.map((t) => (t.id === id ? task : t)));
        this.saving.set(false);
        onSuccess();
      },
      error: () => {
        this.error.set('Failed to update task');
        this.saving.set(false);
      },
    });
  }

  delete(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.items.update((items) => items.filter((t) => t.id !== id));
        this.total.update((t) => Math.max(0, t - 1));
      },
      error: () => this.error.set('Failed to delete task'),
    });
  }

  complete(id: string): void {
    this.http.post<Task>(`${this.apiUrl}/${id}/complete`, {}).subscribe({
      next: (task) => this.items.update((items) => items.map((t) => (t.id === id ? task : t))),
      error: () => this.error.set('Failed to complete task'),
    });
  }

  reopen(id: string): void {
    this.http.post<Task>(`${this.apiUrl}/${id}/reopen`, {}).subscribe({
      next: (task) => this.items.update((items) => items.map((t) => (t.id === id ? task : t))),
      error: () => this.error.set('Failed to reopen task'),
    });
  }
}
