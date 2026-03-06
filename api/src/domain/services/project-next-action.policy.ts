import { Action } from '../entities/action.entity';
import { IProjectNextActionPolicy } from '../interfaces/policies/project-next-action-policy.interface';
import { Project } from '../entities/project.entity';

export class ProjectNextActionPolicy implements IProjectNextActionPolicy {
  ensureProjectHasNextAction(_project: Project, actions: Action[]): boolean {
    return actions.some((a) => a.getStatus() === 'OPEN');
  }
}
