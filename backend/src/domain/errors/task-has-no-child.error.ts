import { DomainError } from './domain-error';

export class TaskHasNoChildError extends DomainError {
  readonly code = 'TASK_HAS_NO_CHILD';
  constructor(id: string) {
    super(`Task with id "${id}" has no child to unlink.`);
    this.name = 'TaskHasNoChildError';
  }
}
