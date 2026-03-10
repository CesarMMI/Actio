import { DomainError } from './domain-error';

export class InvalidTaskDescriptionError extends DomainError {
  readonly code = 'INVALID_TASK_DESCRIPTION';
  constructor() {
    super('Task description must not be empty.');
    this.name = 'InvalidTaskDescriptionError';
  }
}
