import { Task } from '../../../domain/entities/task.entity';
import { ITaskRepository } from '../../../domain/interfaces/ITaskRepository';

export class ListTasksUseCase {
  constructor(private readonly tasks: ITaskRepository) {}

  async execute(): Promise<Task[]> {
    return this.tasks.findAll();
  }
}
