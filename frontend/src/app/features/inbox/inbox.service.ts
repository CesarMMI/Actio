import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CapturedItem } from '../../core/models/captured-item.model';
import { CreateCapturedItemDto } from '../../core/api/create-captured-item.request';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InboxService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/inbox`;

  items = signal<CapturedItem[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<CapturedItem[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load inbox');
        this.loading.set(false);
      },
    });
  }

  capture(dto: CreateCapturedItemDto): void {
    this.http.post<CapturedItem>(this.apiUrl, dto).subscribe({
      next: () => this.load(),
      error: () => this.error.set('Failed to capture item'),
    });
  }

  clarifyAsAction(id: string, actionTitle: string): void {
    this.http.post<void>(`${this.apiUrl}/${id}/clarify-as-action`, { actionTitle }).subscribe({
      next: () => this.items.update((items) => items.filter((i) => i.id !== id)),
      error: () => this.error.set('Failed to clarify item'),
    });
  }

  clarifyAsProject(id: string, projectName: string): void {
    this.http.post<void>(`${this.apiUrl}/${id}/clarify-as-project`, { projectName }).subscribe({
      next: () => this.items.update((items) => items.filter((i) => i.id !== id)),
      error: () => this.error.set('Failed to clarify item'),
    });
  }

  clarifyAsReference(id: string): void {
    this.http.post<void>(`${this.apiUrl}/${id}/clarify-as-reference`, {}).subscribe({
      next: () => this.items.update((items) => items.filter((i) => i.id !== id)),
      error: () => this.error.set('Failed to clarify item'),
    });
  }

  clarifyAsSomeday(id: string): void {
    this.http.post<void>(`${this.apiUrl}/${id}/clarify-as-someday`, {}).subscribe({
      next: () => this.items.update((items) => items.filter((i) => i.id !== id)),
      error: () => this.error.set('Failed to clarify item'),
    });
  }

  trash(id: string): void {
    this.http.post<void>(`${this.apiUrl}/${id}/trash`, {}).subscribe({
      next: () => this.items.update((items) => items.filter((i) => i.id !== id)),
      error: () => this.error.set('Failed to trash item'),
    });
  }
}
