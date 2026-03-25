import { DomainError } from "../domain-error";

export class EmailAlreadyTakenError extends DomainError {
  readonly code = "EMAIL_ALREADY_TAKEN";
  readonly name = "EmailAlreadyTakenError";

  constructor(email: string) {
    super(`Email "${email}" is already taken.`);
  }
}
