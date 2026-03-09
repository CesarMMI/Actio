import { Action } from 'src/domain/entities/action.entity';
import { CapturedItem } from 'src/domain/entities/captured-item.entity';
import { Project } from 'src/domain/entities/project.entity';

export type ClarifyAsProjectResultDto = {
  updatedItem: CapturedItem;
  project: Project;
  actions: Action[];
};
