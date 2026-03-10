import { DomainError } from "../domain-error";

export class InvalidContextTitleError extends DomainError {
  readonly code = "INVALID_CONTEXT_TITLE";
  readonly name = "InvalidContextTitleError";

  constructor() {
    super("Context title must not be empty.");
  }
}
