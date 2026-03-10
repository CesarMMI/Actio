import { v4 as uuid } from "uuid";
import { InvalidProjectTitleError } from "../../errors/project/invalid-project-title.error";
import { Entity } from "../entity/entity";
import { ProjectProps } from "./project.props";

export class Project extends Entity {
  title: string;

  private constructor(props: ProjectProps) {
    super(props);
    this.title = props.title;
  }

  static create(input: { title: string }): Project {
    if (!input.title.trim()) throw new InvalidProjectTitleError();
    const now = new Date();
    return new Project({
      id: uuid(),
      title: input.title,
      createdAt: now,
      updatedAt: now,
    });
  }

  static load(props: ProjectProps): Project {
    return new Project(props);
  }

  rename(title: string): void {
    if (!title.trim()) throw new InvalidProjectTitleError();
    this.title = title;
    this.updatedAt = new Date();
  }
}
