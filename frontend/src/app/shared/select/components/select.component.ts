import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { SelectOption } from '../types/select-option';

@Component({
  selector: 'app-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <select
      [value]="value()"
      (change)="onchange($event)"
      [attr.aria-label]="ariaLabel()"
      [class]="classes()"
    >
      @if (placeholder()) {
        <option value="">{{ placeholder() }}</option>
      }
      @for (opt of options(); track opt.value) {
        <option [value]="opt.value">{{ opt.label }}</option>
      }
    </select>
  `,
})
export class SelectComponent {
  options = input.required<SelectOption[]>();
  value = input.required<string>();
  ariaLabel = input('');
  placeholder = input('');
  size = input<'sm' | 'md'>('md');

  valueChange = output<string>();

  protected classes = computed(() => {
    const base =
      'bg-neutral-800 border border-neutral-700 rounded focus:outline-none focus:ring-1 focus:ring-neutral-400';
    return this.size() === 'sm'
      ? `${base} px-2 py-1.5 text-xs text-neutral-300`
      : `${base} w-full px-3 py-2 text-sm text-neutral-100`;
  });

  onchange(event: Event): void {
    this.valueChange.emit((event.target as HTMLSelectElement).value);
  }
}
