import { DomainError } from './domain-error';

export class InvalidContextTitleError extends DomainError {
  readonly code = 'INVALID_CONTEXT_TITLE';
  constructor() {
    super('Context title must not be empty.');
    this.name = 'InvalidContextTitleError';
  }
}
