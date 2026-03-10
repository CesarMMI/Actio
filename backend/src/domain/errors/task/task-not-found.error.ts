import { DomainError } from "../domain-error";

export class TaskNotFoundError extends DomainError {
  readonly code = "TASK_NOT_FOUND";
  readonly name = "TaskNotFoundError";

  constructor(id: string) {
    super(`Task with id "${id}" was not found.`);
  }
}
