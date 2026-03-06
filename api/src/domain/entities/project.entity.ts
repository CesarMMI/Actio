import { InvalidStatusTransitionError } from '../errors/invalid-status-transition.error';
import { Action } from './action.entity';
import { ProjectStatus } from '../enums/project-status';

export class Project {
  private status: ProjectStatus = 'ACTIVE';

  private constructor(
    readonly id: string,
    private name: string,
    readonly description?: string,
  ) {}

  static create(params: {
    id: string;
    name: string;
    description?: string;
  }): Project {
    if (!params.name.trim()) {
      throw new Error('Project name cannot be empty.');
    }
    return new Project(params.id, params.name.trim(), params.description);
  }

  getName(): string {
    return this.name;
  }

  rename(name: string): void {
    if (!name.trim()) {
      throw new Error('Project name cannot be empty.');
    }
    this.name = name.trim();
  }

  getStatus(): ProjectStatus {
    return this.status;
  }

  complete(actions: Action[]): void {
    const hasOpen = actions.some((a) => a.getStatus() === 'OPEN');
    if (hasOpen) {
      throw new InvalidStatusTransitionError(
        'Project',
        this.status,
        'COMPLETED',
      );
    }
    this.status = 'COMPLETED';
  }

  archive(): void {
    if (this.status === 'ARCHIVED') {
      throw new InvalidStatusTransitionError(
        'Project',
        this.status,
        'ARCHIVED',
      );
    }
    this.status = 'ARCHIVED';
  }
}
