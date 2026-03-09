import { CapturedItem } from '../entities/captured-item';
import { CapturedItemStatus } from '../enums';

export interface ICapturedItemRepository {
  save(item: CapturedItem): Promise<void>;
  findById(id: string): Promise<CapturedItem | null>;
  findByStatus(status: CapturedItemStatus): Promise<CapturedItem[]>;
}
