import { DomainError } from './domain-error';

export class ActionNotCompletedError extends DomainError {
  constructor(id: string) {
    super(`Action "${id}" must be COMPLETED before it can be archived.`);
  }
}
