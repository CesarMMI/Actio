import { DomainError } from "../domain-error";

export class InvalidTaskDescriptionError extends DomainError {
  readonly code = "INVALID_TASK_DESCRIPTION";
  readonly name = "InvalidTaskDescriptionError";

  constructor() {
    super("Task description must not be empty.");
  }
}
