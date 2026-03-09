import { ICapturedItemRepository } from '../../../domain/interfaces';
import { CapturedItemNotFoundError } from '../../errors/captured-item-not-found.error';
import { IMoveToTrashUseCase } from '../../interfaces/captured-item/move-to-trash.use-case.interface';

export class MoveToTrashUseCase implements IMoveToTrashUseCase {
  constructor(private readonly capturedItems: ICapturedItemRepository) {}

  async execute(capturedItemId: string): Promise<void> {
    const item = await this.capturedItems.findById(capturedItemId);
    if (!item) throw new CapturedItemNotFoundError(capturedItemId);

    item.moveToTrash();
    await this.capturedItems.save(item);
  }
}
