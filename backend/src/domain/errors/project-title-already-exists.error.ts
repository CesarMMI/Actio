import { DomainError } from './domain-error';

export class ProjectTitleAlreadyExistsError extends DomainError {
  readonly code = 'PROJECT_TITLE_ALREADY_EXISTS';
  constructor(title: string) {
    super(`A project with the title "${title}" already exists.`);
    this.name = 'ProjectTitleAlreadyExistsError';
  }
}
