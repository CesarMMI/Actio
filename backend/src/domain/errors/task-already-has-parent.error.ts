import { DomainError } from './domain-error';

export class TaskAlreadyHasParentError extends DomainError {
  readonly code = 'TASK_ALREADY_HAS_PARENT';
  constructor(id: string) {
    super(`Task with id "${id}" already has a parent task.`);
    this.name = 'TaskAlreadyHasParentError';
  }
}
