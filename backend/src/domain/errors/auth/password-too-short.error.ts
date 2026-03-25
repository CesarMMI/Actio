import { DomainError } from "../domain-error";

export class PasswordTooShortError extends DomainError {
  readonly code = "PASSWORD_TOO_SHORT";
  readonly name = "PasswordTooShortError";

  constructor(length: number) {
    super(`Password must be at least ${length} characters.`);
  }
}
