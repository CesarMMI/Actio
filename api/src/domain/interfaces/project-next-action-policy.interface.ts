import { Action } from '../action/action.entity';
import { Project } from '../project/project.entity';

export interface IProjectNextActionPolicy {
  ensureProjectHasNextAction(project: Project, actions: Action[]): boolean;
}
