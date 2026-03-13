import { Signal } from '@angular/core';
import { PaginationRequest } from '../types/pagination.api';

export interface IPaginationService<T, P extends PaginationRequest = PaginationRequest> {
  readonly items: Signal<T[]>;

  readonly page: Signal<number>;
  readonly limit: Signal<number>;
  readonly total: Signal<number>;
  readonly totalPages: Signal<number>;

  readonly loading: Signal<boolean>;
  readonly error: Signal<string | null>;

  load(params: P): void;
}
