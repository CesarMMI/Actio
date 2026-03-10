import { DomainError } from './domain-error';

export class InvalidProjectTitleError extends DomainError {
  readonly code = 'INVALID_PROJECT_TITLE';
  constructor() {
    super('Project title must not be empty.');
    this.name = 'InvalidProjectTitleError';
  }
}
