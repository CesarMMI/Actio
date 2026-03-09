import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { IActionRepository } from '../../../domain/interfaces/repositories/action-repository.interface';
import {
  CompleteActionInput,
  CompleteActionOutput,
} from '../../dtos/actions/complete-action.dto';
import { toActionDto } from '../../mappers/action.mapper';
import { ICompleteActionUseCase } from '../../interfaces/use-cases/actions/complete-action.usecase.interface';

@Injectable()
export class CompleteActionUseCase implements ICompleteActionUseCase {
  constructor(
    @Inject(IActionRepository) private readonly actions: IActionRepository,
  ) {}

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
