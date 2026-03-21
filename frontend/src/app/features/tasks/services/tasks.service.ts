import { Injectable, signal } from '@angular/core';
import { Task } from '../../../core/models/task.model';
import { PaginationService } from '../../../shared/pagination/services/pagination.service';
import { TasksRequest } from '../types/task-pagination.api';
import { environment } from '../../../../environments/environment';

export interface TaskPayload {
  description: string;
  contextId: string | null;
  projectId: string | null;
}

@Injectable({ providedIn: 'root' })
export class TasksService extends PaginationService<Task, TasksRequest> {
  protected override readonly apiUrl = `${environment.apiUrl}/tasks`;
  protected override readonly entityName = 'tasks';

  readonly saving = signal(false);

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
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.items.update((items) => items.filter((t) => t.id !== id));
        this.total.update((t) => Math.max(0, t - 1));
      },
      error: () => this.error.set('Failed to delete task'),
    });
  }

  complete(id: string): void {
    this.http.post<Task>(`${this.apiUrl}/${id}/complete`, {}).subscribe({
      next: (task) => {
        this.items.update((items) => items.map((t) => (t.id === id ? task : t)));
      },
      error: () => this.error.set('Failed to complete task'),
    });
  }

  reopen(id: string): void {
    this.http.post<Task>(`${this.apiUrl}/${id}/reopen`, {}).subscribe({
      next: (task) => {
        this.items.update((items) => items.map((t) => (t.id === id ? task : t)));
      },
      error: () => this.error.set('Failed to reopen task'),
    });
  }

  toggleDone(task: Task): void {
    if (task.done) {
      this.reopen(task.id);
    } else {
      this.complete(task.id);
    }
  }
}
