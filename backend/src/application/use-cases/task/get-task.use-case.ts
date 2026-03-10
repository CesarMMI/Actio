import { Task } from '../../../domain/entities/task/task.entity';
import { TaskNotFoundError } from '../../../domain/errors/task/task-not-found.error';
import { ITaskRepository } from '../../../domain/interfaces/task-repository.interface';
import { IGetTaskUseCase } from '../../interfaces/task/get-task.use-case.interface';
import type { GetTaskInput } from '../../types/inputs/task/get-task.input';
import type { GetTaskOutput } from '../../types/outputs/task/get-task.output';

export class GetTaskUseCase implements IGetTaskUseCase {
  constructor(private readonly tasks: ITaskRepository) {}

  async execute(input: GetTaskInput): Promise<GetTaskOutput> {
    const task = await this.tasks.findById(input.id);
    if (!task) throw new TaskNotFoundError(input.id);
    return task;
  }
}
