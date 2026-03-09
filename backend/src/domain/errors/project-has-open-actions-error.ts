import { DomainError } from './domain-error';

export class ProjectHasOpenActionsError extends DomainError {
  constructor(id: string) {
    super(`Project "${id}" cannot be completed while it has OPEN actions.`);
  }
}
