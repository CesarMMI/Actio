import { ProjectStatus } from '../enums';
import {
  ProjectHasOpenActionsError,
  ProjectNotActiveError,
  ProjectNotCompletedError,
} from '../errors';

export interface ProjectProps {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  createdAt: Date;
}

export class Project {
  readonly id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  readonly createdAt: Date;

  constructor(props: ProjectProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.status = props.status;
    this.createdAt = props.createdAt;
  }

  rename(name: string): void {
    this.name = name;
  }

  complete(openActionCount: number): void {
    if (this.status !== ProjectStatus.ACTIVE) {
      throw new ProjectNotActiveError(this.id);
    }
    if (openActionCount > 0) {
      throw new ProjectHasOpenActionsError(this.id);
    }
    this.status = ProjectStatus.COMPLETED;
  }

  archive(): void {
    if (this.status !== ProjectStatus.COMPLETED) {
      throw new ProjectNotCompletedError(this.id);
    }
    this.status = ProjectStatus.ARCHIVED;
  }
}
