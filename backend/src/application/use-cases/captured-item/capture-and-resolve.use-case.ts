import { v4 as uuidv4 } from 'uuid';
import { CapturedItem } from '../../../domain/entities/captured-item';
import { Action } from '../../../domain/entities/action';
import { CapturedItemStatus, ActionStatus } from '../../../domain/enums';
import { ICapturedItemRepository, IActionRepository } from '../../../domain/interfaces';
import {
  ICaptureAndResolveUseCase,
  CaptureAndResolveInput,
  CaptureAndResolveOutput,
} from '../../interfaces/captured-item/capture-and-resolve.use-case.interface';

export class CaptureAndResolveUseCase implements ICaptureAndResolveUseCase {
  constructor(
    private readonly capturedItems: ICapturedItemRepository,
    private readonly actions: IActionRepository,
  ) {}

  async execute(input: CaptureAndResolveInput): Promise<CaptureAndResolveOutput> {
    const item = new CapturedItem({
      id: uuidv4(),
      title: input.title,
      notes: input.notes,
      status: CapturedItemStatus.INBOX,
      createdAt: new Date(),
    });
    item.clarifyAsAction();

    const action = new Action({
      id: uuidv4(),
      title: input.actionTitle,
      notes: input.actionNotes,
      dueDate: input.dueDate,
      timeBucket: input.timeBucket,
      energyLevel: input.energyLevel,
      status: ActionStatus.OPEN,
      projectId: input.projectId,
      contextId: input.contextId,
      createdAt: new Date(),
    });

    await this.capturedItems.save(item);
    await this.actions.save(action);

    return { capturedItem: item, action };
  }
}
