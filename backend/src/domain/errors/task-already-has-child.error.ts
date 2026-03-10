import { DomainError } from './domain-error';

export class TaskAlreadyHasChildError extends DomainError {
  readonly code = 'TASK_ALREADY_HAS_CHILD';
  constructor(id: string) {
    super(`Task with id "${id}" already has a child task.`);
    this.name = 'TaskAlreadyHasChildError';
  }
}
