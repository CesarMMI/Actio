import { ICapturedItemRepository } from '../../../domain/interfaces';
import { CapturedItemNotFoundError } from '../../errors/captured-item-not-found.error';
import { IClarifyAsSomedayUseCase } from '../../interfaces/captured-item/clarify-as-someday.use-case.interface';

export class ClarifyAsSomedayUseCase implements IClarifyAsSomedayUseCase {
  constructor(private readonly capturedItems: ICapturedItemRepository) {}

  async execute(capturedItemId: string): Promise<void> {
    const item = await this.capturedItems.findById(capturedItemId);
    if (!item) throw new CapturedItemNotFoundError(capturedItemId);

    item.clarifyAsSomeday();
    await this.capturedItems.save(item);
  }
}
