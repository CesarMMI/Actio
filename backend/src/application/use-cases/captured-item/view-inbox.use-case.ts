import { CapturedItem } from '../../../domain/entities/captured-item';
import { CapturedItemStatus } from '../../../domain/enums';
import { ICapturedItemRepository } from '../../../domain/interfaces';
import { IViewInboxUseCase } from '../../interfaces/captured-item/view-inbox.use-case.interface';

export class ViewInboxUseCase implements IViewInboxUseCase {
  constructor(private readonly capturedItems: ICapturedItemRepository) {}

  async execute(): Promise<CapturedItem[]> {
    return this.capturedItems.findByStatus(CapturedItemStatus.INBOX);
  }
}
