import { Action } from '../action/action.entity';
import { IProjectNextActionPolicy } from '../interfaces/project-next-action-policy.interface';
import { Project } from '../project/project.entity';

export class ProjectNextActionPolicy implements IProjectNextActionPolicy {
  ensureProjectHasNextAction(_project: Project, actions: Action[]): boolean {
    return actions.some((a) => a.getStatus() === 'OPEN');
  }
}

