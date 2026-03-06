import { CapturedItemStatus } from '../../../domain/enums/captured-item-status';

export type CapturedItemDto = {
  id: string;
  title: string;
  notes?: string;
  status: CapturedItemStatus;
};
