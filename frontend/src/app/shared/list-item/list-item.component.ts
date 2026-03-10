import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <li class="py-4 border-b border-neutral-800 last:border-0">
      @if (titleLink()) {
        <a [routerLink]="titleLink()" class="text-neutral-100 text-sm hover:text-white transition-colors block">{{ title() }}</a>
      } @else {
        <p class="text-neutral-100 text-sm">{{ title() }}</p>
      }

      @if (subtitle()) {
        <p class="text-neutral-500 text-xs mt-1">{{ subtitle() }}</p>
      }

      @if (tags().length > 0) {
        <div class="flex gap-3 flex-wrap mt-2">
          @for (tag of tags(); track tag) {
            <span class="text-xs text-neutral-600">{{ tag }}</span>
          }
        </div>
      }

      <div class="flex gap-4 mt-3" role="group" [attr.aria-label]="'Actions for ' + title()">
        <button
          (click)="edit.emit()"
          class="text-xs text-neutral-400 hover:text-neutral-100 transition-colors"
        >Edit</button>
        <button
          (click)="delete.emit()"
          class="text-xs text-neutral-600 hover:text-red-400 transition-colors"
        >Delete</button>
      </div>
    </li>
  `,
})
export class ListItemComponent {
  title = input.required<string>();
  titleLink = input<unknown[] | null>(null);
  subtitle = input<string | undefined>(undefined);
  tags = input<string[]>([]);

  edit = output<void>();
  delete = output<void>();
}
