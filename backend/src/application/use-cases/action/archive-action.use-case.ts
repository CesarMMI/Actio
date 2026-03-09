import { IActionRepository } from '../../../domain/interfaces';
import { ActionNotFoundError } from '../../errors/action-not-found.error';
import { IArchiveActionUseCase } from '../../interfaces/action/archive-action.use-case.interface';

export class ArchiveActionUseCase implements IArchiveActionUseCase {
  constructor(private readonly actions: IActionRepository) {}

  async execute(actionId: string): Promise<void> {
    const action = await this.actions.findById(actionId);
    if (!action) throw new ActionNotFoundError(actionId);

    action.archive();
    await this.actions.save(action);
  }
}
