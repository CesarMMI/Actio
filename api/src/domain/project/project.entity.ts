import { InvalidStatusTransitionError } from "../errors/invalid-status-transition.error";
import { Action } from '../action/action.entity';
import { ProjectStatus } from "./project-status";

export class Project {
  private status: ProjectStatus = 'ACTIVE';

  private constructor(
    readonly id: string,
    readonly name: string,
    readonly description?: string,
  ) { }

  static create(params: { id: string; name: string; description?: string }): Project {
    if (!params.name.trim()) {
      throw new Error('Project name cannot be empty.');
    }
    return new Project(params.id, params.name.trim(), params.description);
  }

  getStatus(): ProjectStatus {
    return this.status;
  }

  complete(actions: Action[]): void {
    const hasOpen = actions.some((a) => a.getStatus() === 'OPEN');
    if (hasOpen) {
      throw new InvalidStatusTransitionError('Project', this.status, 'COMPLETED');
    }
    this.status = 'COMPLETED';
  }

  archive(): void {
    if (this.status === 'ARCHIVED') {
      throw new InvalidStatusTransitionError('Project', this.status, 'ARCHIVED');
    }
    this.status = 'ARCHIVED';
  }
}

