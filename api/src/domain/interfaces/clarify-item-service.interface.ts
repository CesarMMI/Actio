import { Action } from '../action/action.entity';
import { CapturedItem } from '../captured-item/captured-item.entity';
import { Project } from '../project/project.entity';

export type ClarifyAsActionResult = {
  updatedItem: CapturedItem;
  actions: Action[];
}

export type ClarifyAsProjectResult = {
  updatedItem: CapturedItem;
  project: Project;
  actions: Action[];
}

export interface IClarifyItemService {
  clarifyAsAction(item: CapturedItem, options: { actionId: string; projectId?: string; contextId?: string }): ClarifyAsActionResult
  clarifyAsProject(item: CapturedItem, options: { projectId: string; projectNameOverride?: string; firstActionId?: string }): ClarifyAsProjectResult
}

