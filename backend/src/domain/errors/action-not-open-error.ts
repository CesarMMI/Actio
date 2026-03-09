import { DomainError } from './domain-error';

export class ActionNotOpenError extends DomainError {
  constructor(id: string) {
    super(`Action "${id}" must be OPEN before it can be completed.`);
  }
}
