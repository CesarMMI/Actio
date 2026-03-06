import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { IActionRepository } from '../../../domain/interfaces/repositories/action-repository.interface';
import {
  CompleteActionInput,
  CompleteActionOutput,
} from '../../dtos/actions/complete-action.dto';
import { toActionDto } from '../../mappers/action.mapper';

export class CompleteActionUseCase {
  constructor(private readonly actions: IActionRepository) {}

  async execute(input: CompleteActionInput): Promise<CompleteActionOutput> {
    const action = await this.actions.findByIdForUser(
      input.userId,
      input.actionId,
    );
    if (!action) throw new EntityNotFoundError('Action', input.actionId);

    action.complete();
    const saved = await this.actions.saveForUser(input.userId, action);

    return { action: toActionDto(saved) };
  }
}
