import { IActionRepository, IContextRepository } from '../../../domain/interfaces';
import { ActionNotFoundError } from '../../errors/action-not-found.error';
import { ContextNotFoundError } from '../../errors/context-not-found.error';
import { IAssignActionToContextUseCase, AssignActionToContextInput } from '../../interfaces/action/assign-action-to-context.use-case.interface';

export class AssignActionToContextUseCase implements IAssignActionToContextUseCase {
  constructor(
    private readonly actions: IActionRepository,
    private readonly contexts: IContextRepository,
  ) {}

  async execute(input: AssignActionToContextInput): Promise<void> {
    const action = await this.actions.findById(input.actionId);
    if (!action) throw new ActionNotFoundError(input.actionId);

    if (input.contextId !== null) {
      const context = await this.contexts.findById(input.contextId);
      if (!context) throw new ContextNotFoundError(input.contextId);
    }

    action.assignContext(input.contextId);
    await this.actions.save(action);
  }
}
