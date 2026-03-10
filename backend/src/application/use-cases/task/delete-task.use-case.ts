import { TaskNotFoundError } from '../../../domain/errors/task-not-found.error';
import { ITaskRepository } from '../../../domain/interfaces/ITaskRepository';
import type { DeleteTaskInput } from '../../interfaces/task/delete-task.input';

export class DeleteTaskUseCase {
  constructor(private readonly tasks: ITaskRepository) {}

  async execute(input: DeleteTaskInput): Promise<void> {
    const task = await this.tasks.findById(input.id);
    if (!task) throw new TaskNotFoundError(input.id);

    if (task.parentTaskId !== undefined) {
      const parent = await this.tasks.findById(task.parentTaskId);
      if (parent) {
        parent.removeChild();
        await this.tasks.save(parent);
      }
    }

    if (task.childTaskId !== undefined) {
      const child = await this.tasks.findById(task.childTaskId);
      if (child) {
        child.removeParent();
        await this.tasks.save(child);
      }
    }

    await this.tasks.delete(input.id);
  }
}
