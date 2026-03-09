import { DomainError } from './domain-error';

export class ContextNotActiveError extends DomainError {
  constructor(id: string) {
    super(`Context "${id}" is already inactive.`);
  }
}
