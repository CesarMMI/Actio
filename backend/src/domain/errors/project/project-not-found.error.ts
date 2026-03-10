import { DomainError } from "../domain-error";

export class ProjectNotFoundError extends DomainError {
  readonly code = "PROJECT_NOT_FOUND";
  readonly name = "ProjectNotFoundError";

  constructor(id: string) {
    super(`Project with id "${id}" was not found.`);
  }
}
