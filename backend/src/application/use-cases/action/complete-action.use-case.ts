import { IActionRepository } from '../../../domain/interfaces';
import { ActionNotFoundError } from '../../errors/action-not-found.error';
import { ICompleteActionUseCase } from '../../interfaces/action/complete-action.use-case.interface';

export class CompleteActionUseCase implements ICompleteActionUseCase {
  constructor(private readonly actions: IActionRepository) {}

  async execute(actionId: string): Promise<void> {
    const action = await this.actions.findById(actionId);
    if (!action) throw new ActionNotFoundError(actionId);

    action.complete();
    await this.actions.save(action);
  }
}
