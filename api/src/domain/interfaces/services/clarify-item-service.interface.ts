import { CapturedItem } from '../../entities/captured-item.entity';
import { ClarifyAsActionResultDto } from '../../dtos/clarify-as-action-result.dto';
import { ClarifyAsProjectResultDto } from '../../dtos/clarify-as-project-result.dto';

export const IClarifyItemService = Symbol('IClarifyItemService');

export interface IClarifyItemService {
  clarifyAsAction(
    item: CapturedItem,
    options: { actionId: string; projectId?: string; contextId?: string },
  ): ClarifyAsActionResultDto;
  clarifyAsProject(
    item: CapturedItem,
    options: {
      projectId: string;
      projectNameOverride?: string;
      firstActionId?: string;
    },
  ): ClarifyAsProjectResultDto;
}
