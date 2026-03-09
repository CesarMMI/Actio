import { DomainError } from './domain-error';

export class ProjectNotActiveError extends DomainError {
  constructor(id: string) {
    super(`Project "${id}" must be ACTIVE before it can be completed.`);
  }
}
