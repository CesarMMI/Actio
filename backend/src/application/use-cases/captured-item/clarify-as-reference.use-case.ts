import { ICapturedItemRepository } from '../../../domain/interfaces';
import { CapturedItemNotFoundError } from '../../errors/captured-item-not-found.error';
import { IClarifyAsReferenceUseCase } from '../../interfaces/captured-item/clarify-as-reference.use-case.interface';

export class ClarifyAsReferenceUseCase implements IClarifyAsReferenceUseCase {
  constructor(private readonly capturedItems: ICapturedItemRepository) {}

  async execute(capturedItemId: string): Promise<void> {
    const item = await this.capturedItems.findById(capturedItemId);
    if (!item) throw new CapturedItemNotFoundError(capturedItemId);

    item.clarifyAsReference();
    await this.capturedItems.save(item);
  }
}
