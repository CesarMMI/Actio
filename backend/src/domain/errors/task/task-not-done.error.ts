import { DomainError } from "../domain-error";

export class TaskNotDoneError extends DomainError {
  readonly code = "TASK_NOT_DONE";
  readonly name = "TaskNotDoneError";

  constructor(id: string) {
    super(`Task with id "${id}" is not done.`);
  }
}
