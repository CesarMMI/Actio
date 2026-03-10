import { DomainError } from './domain-error';

export class TaskCircularReferenceError extends DomainError {
  readonly code = 'TASK_CIRCULAR_REFERENCE';
  constructor() {
    super('Assigning this child would create a circular reference in the task chain.');
    this.name = 'TaskCircularReferenceError';
  }
}
