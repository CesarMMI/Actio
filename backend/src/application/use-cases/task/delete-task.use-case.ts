import { TaskNotFoundError } from '../../../domain/errors/task/task-not-found.error';
import { ITaskRepository } from '../../../domain/interfaces/task-repository.interface';
import { IDeleteTaskUseCase } from '../../interfaces/task/delete-task.use-case.interface';
import type { DeleteTaskInput } from '../../types/inputs/task/delete-task.input';
import type { DeleteTaskOutput } from '../../types/outputs/task/delete-task.output';

export class DeleteTaskUseCase implements IDeleteTaskUseCase {
  constructor(private readonly tasks: ITaskRepository) {}

  async execute(input: DeleteTaskInput): Promise<DeleteTaskOutput> {
    const task = await this.tasks.findById(input.id);
    if (!task) throw new TaskNotFoundError(input.id);
    await this.tasks.delete(input.id);
  }
}
