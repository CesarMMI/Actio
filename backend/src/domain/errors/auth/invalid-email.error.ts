import { DomainError } from "../domain-error";

export class InvalidEmailError extends DomainError {
  readonly code = "INVALID_EMAIL";
  readonly name = "InvalidEmailError";

  constructor() {
    super("Email address is invalid.");
  }
}
