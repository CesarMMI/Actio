import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Project, ProjectStatus } from '../../core/models/project.model';
import { Action } from '../../core/models/action.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/projects`;

  items = signal<Project[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  current = signal<Project | null>(null);
  currentActions = signal<Action[]>([]);
  detailLoading = signal(false);
  detailError = signal<string | null>(null);

  load(status?: ProjectStatus): void {
    this.loading.set(true);
    this.error.set(null);

    const params = new HttpParams();
    if (status) params.set('status', status.toString());

    this.http.get<Project[]>(this.apiUrl, { params }).subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load projects');
        this.loading.set(false);
      },
    });
  }

  loadOne(id: string): void {
    this.detailLoading.set(true);
    this.detailError.set(null);
    this.http.get<{ project: Project; actions: Action[] }>(`${this.apiUrl}/${id}`).subscribe({
      next: ({ project, actions }) => {
        this.current.set(project);
        this.currentActions.set(actions);
        this.detailLoading.set(false);
      },
      error: () => {
        this.detailError.set('Failed to load project');
        this.detailLoading.set(false);
      },
    });
  }

  complete(id: string): void {
    this.http.post<void>(`${this.apiUrl}/${id}/complete`, {}).subscribe({
      next: () => this.items.update((items) => items.filter((p) => p.id !== id)),
      error: () => this.error.set('Failed to complete project'),
    });
  }

  archive(id: string): void {
    this.http.post<void>(`${this.apiUrl}/${id}/archive`, {}).subscribe({
      next: () => this.items.update((items) => items.filter((p) => p.id !== id)),
      error: () => this.error.set('Failed to archive project'),
    });
  }
}
