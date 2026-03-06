import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { IActionRepository } from '../../../domain/interfaces/repositories/action-repository.interface';
import { IContextRepository } from '../../../domain/interfaces/repositories/context-repository.interface';
import {
  AssignActionToContextInput,
  AssignActionToContextOutput,
} from '../../dtos/actions/assign-action-to-context.dto';
import { toActionDto } from '../../mappers/action.mapper';

export class AssignActionToContextUseCase {
  constructor(
    private readonly actions: IActionRepository,
    private readonly contexts: IContextRepository,
  ) {}

  async execute(
    input: AssignActionToContextInput,
  ): Promise<AssignActionToContextOutput> {
    const action = await this.actions.findByIdForUser(
      input.userId,
      input.actionId,
    );
    if (!action) throw new EntityNotFoundError('Action', input.actionId);

    if (input.contextId) {
      const ctx = await this.contexts.findByIdForUser(
        input.userId,
        input.contextId,
      );
      if (!ctx) throw new EntityNotFoundError('Context', input.contextId);
    }

    action.assignContext(input.contextId);
    const saved = await this.actions.saveForUser(input.userId, action);
    return { action: toActionDto(saved) };
  }
}
