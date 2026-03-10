import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../core/models/task.model';
import { environment } from '../../../environments/environment';

export interface TaskPayload {
  description: string;
  contextId: string | null;
  projectId: string | null;
}

@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  items = signal<Task[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  saving = signal(false);

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<Task[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.items.set(data);
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
      next: () => this.items.update((items) => items.filter((t) => t.id !== id)),
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
