import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Project } from '../../../core/models/project.model';
import { PaginatedResult } from '../../../core/models/paginated-result.model';
import { environment } from '../../../../environments/environment';

export interface ProjectListParams {
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
export class ProjectsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/projects`;

  items = signal<Project[]>([]);
  total = signal(0);
  page = signal(1);
  limit = signal(20);
  loading = signal(false);
  error = signal<string | null>(null);

  saving = signal(false);

  current = signal<Project | null>(null);
  detailLoading = signal(false);
  detailError = signal<string | null>(null);

  load(params: ProjectListParams = {}): void {
    this.loading.set(true);
    this.error.set(null);
    this.http
      .get<PaginatedResult<Project>>(this.apiUrl, { params: buildParams(params as Record<string, string | number | undefined>) })
      .subscribe({
        next: (data) => {
          this.items.set(data.items);
          this.total.set(data.total);
          this.page.set(data.page);
          this.limit.set(data.limit);
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
    this.http.get<Project>(`${this.apiUrl}/${id}`).subscribe({
      next: (project) => {
        this.current.set(project);
        this.detailLoading.set(false);
      },
      error: () => {
        this.detailError.set('Failed to load project');
        this.detailLoading.set(false);
      },
    });
  }

  create(title: string, onSuccess: () => void): void {
    this.saving.set(true);
    this.error.set(null);
    this.http.post<Project>(this.apiUrl, { title }).subscribe({
      next: (project) => {
        this.items.update((items) => [...items, project]);
        this.total.update((t) => t + 1);
        this.saving.set(false);
        onSuccess();
      },
      error: () => {
        this.error.set('Failed to create project');
        this.saving.set(false);
      },
    });
  }

  update(id: string, title: string, onSuccess: () => void): void {
    this.saving.set(true);
    this.detailError.set(null);
    this.http.patch<Project>(`${this.apiUrl}/${id}`, { title }).subscribe({
      next: (project) => {
        this.current.set(project);
        this.items.update((items) => items.map((p) => (p.id === id ? project : p)));
        this.saving.set(false);
        onSuccess();
      },
      error: () => {
        this.detailError.set('Failed to update project');
        this.saving.set(false);
      },
    });
  }

  delete(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.items.update((items) => items.filter((p) => p.id !== id));
        this.total.update((t) => Math.max(0, t - 1));
      },
      error: () => this.error.set('Failed to delete project'),
    });
  }
}
