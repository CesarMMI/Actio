import { ActionDto } from '../actions/action.dto';
import { CapturedItemDto } from './captured-item.dto';
import { ProjectDto } from '../projects/project.dto';

export type ClarifyCapturedItemAsProjectInput = {
  userId: string;
  capturedItemId: string;
  projectNameOverride?: string;
  createFirstAction?: boolean;
};

export type ClarifyCapturedItemAsProjectOutput = {
  item: CapturedItemDto;
  project: ProjectDto;
  actions: ActionDto[];
};
