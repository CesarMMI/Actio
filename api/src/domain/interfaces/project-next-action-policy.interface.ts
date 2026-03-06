import { Action } from '../entities/action.entity';
import { Project } from '../entities/project.entity';

export interface IProjectNextActionPolicy {
  ensureProjectHasNextAction(project: Project, actions: Action[]): boolean;
}
