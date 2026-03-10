import { CapturedItemStatus } from '../enums/captured-item-status.enum';

export interface CapturedItem {
  id: string;
  title: string;
  notes?: string;
  status: CapturedItemStatus;
  createdAt: string;
  updatedAt: string;
}
