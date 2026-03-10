import { TaskNotFoundError } from '../../../domain/errors/task/task-not-found.error';
import { ITaskRepository } from '../../../domain/interfaces/task-repository.interface';
import { IReopenTaskUseCase } from '../../interfaces/task/reopen-task.use-case.interface';
import type { ReopenTaskInput } from '../../types/inputs/task/reopen-task.input';
import type { ReopenTaskOutput } from '../../types/outputs/task/reopen-task.output';

export class ReopenTaskUseCase implements IReopenTaskUseCase {
  constructor(private readonly tasks: ITaskRepository) {}

  async execute(input: ReopenTaskInput): Promise<ReopenTaskOutput> {
    const task = await this.tasks.findById(input.id);
    if (!task) throw new TaskNotFoundError(input.id);
    task.reopen();
    return this.tasks.save(task);
  }
}
