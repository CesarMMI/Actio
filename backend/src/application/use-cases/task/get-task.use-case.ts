import { Task } from '../../../domain/entities/task.entity';
import { TaskNotFoundError } from '../../../domain/errors/task-not-found.error';
import { ITaskRepository } from '../../../domain/interfaces/ITaskRepository';
import type { GetTaskInput } from '../../interfaces/task/get-task.input';

export class GetTaskUseCase {
  constructor(private readonly tasks: ITaskRepository) {}

  async execute(input: GetTaskInput): Promise<Task> {
    const task = await this.tasks.findById(input.id);
    if (!task) throw new TaskNotFoundError(input.id);
    return task;
  }
}
