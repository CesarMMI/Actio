import { DomainError } from './domain-error';

export class ProjectHasTasksError extends DomainError {
  readonly code = 'PROJECT_HAS_TASKS';
  constructor(id: string) {
    super(`Project with id "${id}" cannot be deleted because it is referenced by one or more tasks.`);
    this.name = 'ProjectHasTasksError';
  }
}
