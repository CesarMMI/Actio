import { ActionDto } from '../actions/action.dto';
import { ProjectDto } from './project.dto';

export type GetProjectDetailInput = {
  userId: string;
  projectId: string;
};

export type GetProjectDetailOutput = {
  project: ProjectDto;
  openActions: ActionDto[];
  completedActions: ActionDto[];
};
