import { DomainError } from "../domain-error";

export class TaskAlreadyDoneError extends DomainError {
  readonly code = "TASK_ALREADY_DONE";
  readonly name = "TaskAlreadyDoneError";

  constructor(id: string) {
    super(`Task with id "${id}" is already done.`);
  }
}
