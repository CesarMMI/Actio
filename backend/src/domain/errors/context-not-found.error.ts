import { DomainError } from './domain-error';

export class ContextNotFoundError extends DomainError {
  readonly code = 'CONTEXT_NOT_FOUND';
  constructor(id: string) {
    super(`Context with id "${id}" was not found.`);
    this.name = 'ContextNotFoundError';
  }
}
