import { DomainError } from "../domain-error";

export class InvalidCredentialsError extends DomainError {
  readonly code = "INVALID_CREDENTIALS";
  readonly name = "InvalidCredentialsError";

  constructor() {
    super("Invalid email or password.");
  }
}
