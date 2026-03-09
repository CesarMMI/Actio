import { DomainError } from './domain-error';

export class ItemAlreadyResolvedError extends DomainError {
  constructor(id: string) {
    super(`CapturedItem "${id}" has already been resolved and cannot be resolved again.`);
  }
}
