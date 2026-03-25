import { DomainError } from "../domain-error";

export class UserNotFoundError extends DomainError {
  readonly code = "USER_NOT_FOUND";
  readonly name = "UserNotFoundError";

  constructor() {
    super(`User not found.`);
  }
}
