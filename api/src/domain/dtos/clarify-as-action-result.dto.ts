import { Action } from 'src/domain/entities/action.entity';
import { CapturedItem } from 'src/domain/entities/captured-item.entity';

export type ClarifyAsActionResultDto = {
  updatedItem: CapturedItem;
  actions: Action[];
};
