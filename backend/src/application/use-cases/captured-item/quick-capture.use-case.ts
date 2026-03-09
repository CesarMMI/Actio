import { v4 as uuidv4 } from 'uuid';
import { CapturedItem } from '../../../domain/entities/captured-item';
import { CapturedItemStatus } from '../../../domain/enums';
import { ICapturedItemRepository } from '../../../domain/interfaces';
import { IQuickCaptureUseCase, QuickCaptureInput } from '../../interfaces/captured-item/quick-capture.use-case.interface';

export class QuickCaptureUseCase implements IQuickCaptureUseCase {
  constructor(private readonly capturedItems: ICapturedItemRepository) {}

  async execute(input: QuickCaptureInput): Promise<CapturedItem> {
    const item = new CapturedItem({
      id: uuidv4(),
      title: input.title,
      notes: input.notes,
      status: CapturedItemStatus.INBOX,
      createdAt: new Date(),
    });
    await this.capturedItems.save(item);
    return item;
  }
}
