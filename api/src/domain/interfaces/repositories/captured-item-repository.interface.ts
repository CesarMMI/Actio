import { CapturedItem } from '../../entities/captured-item.entity';

export interface ICapturedItemRepository {
  saveForUser(userId: string, item: CapturedItem): Promise<CapturedItem>;
  findByIdForUser(userId: string, id: string): Promise<CapturedItem | null>;
  findInboxByUser(
    userId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<CapturedItem[]>;
}
