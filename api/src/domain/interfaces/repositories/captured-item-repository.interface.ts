import { CapturedItem } from '../../entities/captured-item.entity';

export const ICapturedItemRepository = Symbol('ICapturedItemRepository');

export interface ICapturedItemRepository {
  saveForUser(userId: string, item: CapturedItem): Promise<CapturedItem>;
  findByIdForUser(userId: string, id: string): Promise<CapturedItem | null>;
  findInboxByUser(
    userId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<CapturedItem[]>;
}
