import { Action } from '../../../domain/entities/action';
import { ActionStatus } from '../../../domain/enums';
import { IActionRepository, IContextRepository } from '../../../domain/interfaces';
import { ContextNotFoundError } from '../../errors/context-not-found.error';
import { IExecuteByContextUseCase } from '../../interfaces/context/execute-by-context.use-case.interface';

export class ExecuteByContextUseCase implements IExecuteByContextUseCase {
  constructor(
    private readonly contexts: IContextRepository,
    private readonly actions: IActionRepository,
  ) {}

  async execute(contextId: string): Promise<Action[]> {
    const context = await this.contexts.findById(contextId);
    if (!context) throw new ContextNotFoundError(contextId);

    return this.actions.findByFilters({ contextId, status: ActionStatus.OPEN });
  }
}
