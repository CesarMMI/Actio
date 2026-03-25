import { DomainError } from "../domain-error";

export class RefreshTokenExpiredError extends DomainError {
  readonly code = "REFRESH_TOKEN_EXPIRED";
  readonly name = "RefreshTokenExpiredError";

  constructor() {
    super("Refresh token has expired.");
  }
}
