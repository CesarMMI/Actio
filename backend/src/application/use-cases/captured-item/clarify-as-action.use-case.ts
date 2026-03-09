import { v4 as uuidv4 } from 'uuid';
import { Action } from '../../../domain/entities/action';
import { ActionStatus } from '../../../domain/enums';
import { ICapturedItemRepository, IActionRepository } from '../../../domain/interfaces';
import { CapturedItemNotFoundError } from '../../errors/captured-item-not-found.error';
import { IClarifyAsActionUseCase, ClarifyAsActionInput } from '../../interfaces/captured-item/clarify-as-action.use-case.interface';

export class ClarifyAsActionUseCase implements IClarifyAsActionUseCase {
  constructor(
    private readonly capturedItems: ICapturedItemRepository,
    private readonly actions: IActionRepository,
  ) {}

  async execute(input: ClarifyAsActionInput): Promise<Action> {
    const item = await this.capturedItems.findById(input.capturedItemId);
    if (!item) throw new CapturedItemNotFoundError(input.capturedItemId);

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

    return action;
  }
}
