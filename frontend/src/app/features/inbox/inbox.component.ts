import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { InboxService } from './inbox.service';

type ClarifyMode = { itemId: string; type: 'action' | 'project'; value: string } | null;

@Component({
  selector: 'app-inbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-2xl mx-auto px-6 py-10">

        <!-- Header -->
        <div class="flex items-baseline gap-3 mb-8">
          <h1 class="text-neutral-100 text-lg font-medium">Inbox</h1>
          @if (inbox.items().length > 0) {
            <span class="text-neutral-600 text-sm">{{ inbox.items().length }}</span>
          }
        </div>

        <!-- Capture form -->
        <form (submit)="capture($event)" class="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="Capture a thought..."
            [value]="title()"
            (input)="onTitleInput($event)"
            class="flex-1 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-100 text-sm placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-400"
            aria-label="New inbox item"
          />
          <button
            type="submit"
            [disabled]="!isValid()"
            class="bg-neutral-100 text-neutral-900 text-sm px-4 py-2 rounded hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </form>

        <!-- Error -->
        @if (inbox.error()) {
          <p class="text-red-400 text-sm mb-4" role="alert">{{ inbox.error() }}</p>
        }

        <!-- Loading -->
        @if (inbox.loading()) {
          <p class="text-neutral-600 text-sm" aria-live="polite">Loading...</p>
        }

        <!-- Empty state -->
        @if (!inbox.loading() && inbox.items().length === 0) {
          <p class="text-neutral-700 text-sm text-center py-16">Inbox is empty</p>
        }

        <!-- Items -->
        @if (inbox.items().length > 0) {
          <ul aria-label="Inbox items">
            @for (item of inbox.items(); track item.id) {
              <li class="py-4 border-b border-neutral-800 last:border-0">
                <p class="text-neutral-100 text-sm mb-3">{{ item.title }}</p>
                @if (item.notes) {
                  <p class="text-neutral-500 text-xs mb-3">{{ item.notes }}</p>
                }

                <!-- Clarify as Action inline form -->
                @if (clarifyMode()?.itemId === item.id && clarifyMode()?.type === 'action') {
                  <form (submit)="submitClarifyAction($event, item.id)" class="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Action title..."
                      [value]="clarifyMode()!.value"
                      (input)="onClarifyInput($event)"
                      class="flex-1 bg-neutral-800 border border-neutral-600 rounded px-3 py-1.5 text-neutral-100 text-xs placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                      aria-label="Action title"
                      autofocus
                    />
                    <button
                      type="submit"
                      [disabled]="!clarifyMode()!.value.trim()"
                      class="bg-neutral-100 text-neutral-900 text-xs px-3 py-1.5 rounded hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >Save</button>
                    <button type="button" (click)="cancelClarify()" class="text-xs text-neutral-600 hover:text-neutral-400 transition-colors">Cancel</button>
                  </form>
                }

                <!-- Clarify as Project inline form -->
                @if (clarifyMode()?.itemId === item.id && clarifyMode()?.type === 'project') {
                  <form (submit)="submitClarifyProject($event, item.id)" class="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Project name..."
                      [value]="clarifyMode()!.value"
                      (input)="onClarifyInput($event)"
                      class="flex-1 bg-neutral-800 border border-neutral-600 rounded px-3 py-1.5 text-neutral-100 text-xs placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                      aria-label="Project name"
                      autofocus
                    />
                    <button
                      type="submit"
                      [disabled]="!clarifyMode()!.value.trim()"
                      class="bg-neutral-100 text-neutral-900 text-xs px-3 py-1.5 rounded hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >Save</button>
                    <button type="button" (click)="cancelClarify()" class="text-xs text-neutral-600 hover:text-neutral-400 transition-colors">Cancel</button>
                  </form>
                }

                <div class="flex gap-4 flex-wrap" role="group" [attr.aria-label]="'Actions for ' + item.title">
                  <button (click)="startClarify(item.id, 'action')" class="text-xs text-neutral-400 hover:text-neutral-100 transition-colors">Action</button>
                  <button (click)="startClarify(item.id, 'project')" class="text-xs text-neutral-400 hover:text-neutral-100 transition-colors">Project</button>
                  <button (click)="inbox.clarifyAsReference(item.id)" class="text-xs text-neutral-400 hover:text-neutral-100 transition-colors">Reference</button>
                  <button (click)="inbox.clarifyAsSomeday(item.id)" class="text-xs text-neutral-400 hover:text-neutral-100 transition-colors">Someday</button>
                  <button (click)="inbox.trash(item.id)" class="text-xs text-neutral-600 hover:text-red-400 transition-colors">Trash</button>
                </div>
              </li>
            }
          </ul>
        }

    </div>
  `,
})
export class InboxComponent implements OnInit {
  inbox = inject(InboxService);

  title = signal('');
  isValid = computed(() => this.title().trim().length > 0);
  clarifyMode = signal<ClarifyMode>(null);

  ngOnInit(): void {
    this.inbox.load();
  }

  onTitleInput(event: Event): void {
    this.title.set((event.target as HTMLInputElement).value);
  }

  capture(event: Event): void {
    event.preventDefault();
    if (!this.isValid()) return;
    this.inbox.capture({ title: this.title().trim() });
    this.title.set('');
  }

  startClarify(itemId: string, type: 'action' | 'project'): void {
    this.clarifyMode.set({ itemId, type, value: '' });
  }

  cancelClarify(): void {
    this.clarifyMode.set(null);
  }

  onClarifyInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const current = this.clarifyMode();
    if (current) this.clarifyMode.set({ ...current, value });
  }

  submitClarifyAction(event: Event, itemId: string): void {
    event.preventDefault();
    const value = this.clarifyMode()?.value.trim();
    if (!value) return;
    this.inbox.clarifyAsAction(itemId, value);
    this.clarifyMode.set(null);
  }

  submitClarifyProject(event: Event, itemId: string): void {
    event.preventDefault();
    const value = this.clarifyMode()?.value.trim();
    if (!value) return;
    this.inbox.clarifyAsProject(itemId, value);
    this.clarifyMode.set(null);
  }
}
