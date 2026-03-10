import { ContextHasTasksError } from "../../../domain/errors/context/context-has-tasks.error";
import { ContextNotFoundError } from "../../../domain/errors/context/context-not-found.error";
import { IContextRepository } from "../../../domain/interfaces/context-repository.interface";
import { ITaskRepository } from "../../../domain/interfaces/task-repository.interface";
import { IDeleteContextUseCase } from "../../interfaces/context/delete-context.use-case.interface";
import type { DeleteContextInput } from "../../types/inputs/context/delete-context.input";
import type { DeleteContextOutput } from "../../types/outputs/context/delete-context.output";

export class DeleteContextUseCase implements IDeleteContextUseCase {
  constructor(
    private readonly contexts: IContextRepository,
    private readonly tasks: ITaskRepository,
  ) {}

  async execute(input: DeleteContextInput): Promise<DeleteContextOutput> {
    const context = await this.contexts.findById(input.id);
    if (!context) throw new ContextNotFoundError(input.id);

    const referencingTasks = await this.tasks.findByContextId(input.id);
    if (referencingTasks.length > 0) throw new ContextHasTasksError(input.id);

    await this.contexts.delete(input.id);
  }
}
