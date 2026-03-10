import { DomainError } from "./../domain-error";

export class ContextNotFoundError extends DomainError {
  readonly code = "CONTEXT_NOT_FOUND";
  readonly name = "ContextNotFoundError";

  constructor(id: string) {
    super(`Context with id "${id}" was not found.`);
  }
}
