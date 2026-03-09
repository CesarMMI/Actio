import { DomainError } from './domain-error';

export class ProjectNotCompletedError extends DomainError {
  constructor(id: string) {
    super(`Project "${id}" must be COMPLETED before it can be archived.`);
  }
}
