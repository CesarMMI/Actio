import { ITaskRepository } from '../../../domain/interfaces/task-repository.interface';
import { IListTasksUseCase } from '../../interfaces/task/list-tasks.use-case.interface';
import type { ListTasksOutput } from '../../types/outputs/task/list-tasks.output';

export class ListTasksUseCase implements IListTasksUseCase {
  constructor(private readonly tasks: ITaskRepository) {}

  async execute(): Promise<ListTasksOutput> {
    return this.tasks.findAll();
  }
}
