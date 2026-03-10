import { DomainError } from './domain-error';

export class ProjectNotFoundError extends DomainError {
  readonly code = 'PROJECT_NOT_FOUND';
  constructor(id: string) {
    super(`Project with id "${id}" was not found.`);
    this.name = 'ProjectNotFoundError';
  }
}
