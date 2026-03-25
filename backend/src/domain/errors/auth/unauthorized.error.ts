import { DomainError } from "../domain-error";

export class UnauthorizedError extends DomainError {
  readonly code = "UNAUTHORIZED";
  readonly name = "UnauthorizedError";

  constructor() {
    super("Missing or invalid access token.");
  }
}
