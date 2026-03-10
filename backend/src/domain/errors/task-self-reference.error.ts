import { DomainError } from './domain-error';

export class TaskSelfReferenceError extends DomainError {
  readonly code = 'TASK_SELF_REFERENCE';
  constructor() {
    super('A task cannot reference itself as a parent or child.');
    this.name = 'TaskSelfReferenceError';
  }
}
