import { DomainError } from './domain-error';

export class ContextAlreadyActiveError extends DomainError {
  constructor(id: string) {
    super(`Context "${id}" is already active.`);
  }
}
