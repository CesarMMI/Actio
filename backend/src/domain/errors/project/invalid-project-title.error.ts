import { DomainError } from "../domain-error";

export class InvalidProjectTitleError extends DomainError {
  readonly code = "INVALID_PROJECT_TITLE";
  readonly name = "InvalidProjectTitleError";
  
  constructor() {
    super("Project title must not be empty.");
  }
}
