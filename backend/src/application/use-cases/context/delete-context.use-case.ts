import { ContextHasTasksError } from '../../../domain/errors/context-has-tasks.error';
import { ContextNotFoundError } from '../../../domain/errors/context-not-found.error';
import { IContextRepository } from '../../../domain/interfaces/IContextRepository';
import { ITaskRepository } from '../../../domain/interfaces/ITaskRepository';
import type { DeleteContextInput } from '../../interfaces/context/delete-context.input';

export class DeleteContextUseCase {
  constructor(
    private readonly contexts: IContextRepository,
    private readonly tasks: ITaskRepository,
  ) {}

  async execute(input: DeleteContextInput): Promise<void> {
    const context = await this.contexts.findById(input.id);
    if (!context) throw new ContextNotFoundError(input.id);

    const referencingTasks = await this.tasks.findByContextId(input.id);
    if (referencingTasks.length > 0) throw new ContextHasTasksError(input.id);

    await this.contexts.delete(input.id);
  }
}
