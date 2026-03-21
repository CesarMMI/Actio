import { TaskNotFoundError } from '../../../domain/errors/task/task-not-found.error';
import { ITaskRepository } from '../../../domain/interfaces/task-repository.interface';
import { ICompleteTaskUseCase } from '../../interfaces/task/complete-task.use-case.interface';
import type { CompleteTaskInput } from '../../types/inputs/task/complete-task.input';
import type { CompleteTaskOutput } from '../../types/outputs/task/complete-task.output';

export class CompleteTaskUseCase implements ICompleteTaskUseCase {
  constructor(private readonly tasks: ITaskRepository) {}

  async execute(input: CompleteTaskInput): Promise<CompleteTaskOutput> {
    const task = await this.tasks.findById(input.id);
    if (!task) throw new TaskNotFoundError(input.id);
    task.complete();
    await this.tasks.save(task);
    return task;
  }
}
