import { DomainError } from './domain-error';

export class ContextTitleAlreadyExistsError extends DomainError {
  readonly code = 'CONTEXT_TITLE_ALREADY_EXISTS';
  constructor(title: string) {
    super(`A context with the title "${title}" already exists.`);
    this.name = 'ContextTitleAlreadyExistsError';
  }
}
