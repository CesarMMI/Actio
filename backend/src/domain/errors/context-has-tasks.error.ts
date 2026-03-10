import { DomainError } from './domain-error';

export class ContextHasTasksError extends DomainError {
  readonly code = 'CONTEXT_HAS_TASKS';
  constructor(id: string) {
    super(`Context with id "${id}" cannot be deleted because it is referenced by one or more tasks.`);
    this.name = 'ContextHasTasksError';
  }
}
