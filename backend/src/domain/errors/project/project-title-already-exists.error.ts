import { DomainError } from "../domain-error";

export class ProjectTitleAlreadyExistsError extends DomainError {
  readonly code = "PROJECT_TITLE_ALREADY_EXISTS";
  readonly name = "ProjectTitleAlreadyExistsError";
  
  constructor(title: string) {
    super(`A project with the title "${title}" already exists.`);
  }
}
