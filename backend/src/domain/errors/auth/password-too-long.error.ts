import { DomainError } from "../domain-error";

export class PasswordTooLongError extends DomainError {
  readonly code = "PASSWORD_TOO_LONG";
  readonly name = "PasswordTooLongError";

  constructor(length: number) {
    super(`Password must be at most ${length} characters.`);
  }
}
