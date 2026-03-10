import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../../../core/models/project.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/projects`;

  items = signal<Project[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  saving = signal(false);

  current = signal<Project | null>(null);
  detailLoading = signal(false);
  detailError = signal<string | null>(null);

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<Project[]>(this.apiUrl).subscribe({
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
      next: () => this.items.update((items) => items.filter((p) => p.id !== id)),
      error: () => this.error.set('Failed to delete project'),
    });
  }
}
