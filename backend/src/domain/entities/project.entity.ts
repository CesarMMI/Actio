import { v4 as uuid } from 'uuid';
import { InvalidProjectTitleError } from '../errors/invalid-project-title.error';

export interface ProjectProps {
  readonly id: string;
  title: string;
  readonly createdAt: Date;
  updatedAt: Date;
}

export class Project {
  readonly id: string;
  title: string;
  readonly createdAt: Date;
  updatedAt: Date;

  private constructor(props: ProjectProps) {
    this.id = props.id;
    this.title = props.title;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
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

  static reconstitute(props: ProjectProps): Project {
    return new Project(props);
  }

  rename(title: string): void {
    if (!title.trim()) throw new InvalidProjectTitleError();
    this.title = title;
    this.updatedAt = new Date();
  }
}
