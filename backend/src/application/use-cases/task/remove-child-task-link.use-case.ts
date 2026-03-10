import { Task } from '../../../domain/entities/task.entity';
import { TaskHasNoChildError } from '../../../domain/errors/task-has-no-child.error';
import { TaskNotFoundError } from '../../../domain/errors/task-not-found.error';
import { ITaskRepository } from '../../../domain/interfaces/ITaskRepository';
import type { RemoveChildTaskLinkInput } from '../../interfaces/task/remove-child-task-link.input';

export class RemoveChildTaskLinkUseCase {
  constructor(private readonly tasks: ITaskRepository) {}

  async execute(input: RemoveChildTaskLinkInput): Promise<{ parent: Task; child: Task }> {
    const parent = await this.tasks.findById(input.parentId);
    if (!parent) throw new TaskNotFoundError(input.parentId);
    if (parent.childTaskId === undefined) throw new TaskHasNoChildError(parent.id);

    const child = await this.tasks.findById(parent.childTaskId);
    if (!child) throw new TaskNotFoundError(parent.childTaskId);

    parent.removeChild();
    child.removeParent();

    const savedParent = await this.tasks.save(parent);
    const savedChild = await this.tasks.save(child);

    return { parent: savedParent, child: savedChild };
  }
}
