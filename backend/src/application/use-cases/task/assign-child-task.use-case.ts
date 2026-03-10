import { Task } from '../../../domain/entities/task.entity';
import { TaskCircularReferenceError } from '../../../domain/errors/task-circular-reference.error';
import { TaskNotFoundError } from '../../../domain/errors/task-not-found.error';
import { ITaskRepository } from '../../../domain/interfaces/ITaskRepository';
import type { AssignChildTaskInput } from '../../interfaces/task/assign-child-task.input';

export class AssignChildTaskUseCase {
  constructor(private readonly tasks: ITaskRepository) {}

  async execute(input: AssignChildTaskInput): Promise<{ parent: Task; child: Task }> {
    const parent = await this.tasks.findById(input.parentId);
    if (!parent) throw new TaskNotFoundError(input.parentId);

    const child = await this.tasks.findById(input.childId);
    if (!child) throw new TaskNotFoundError(input.childId);

    if (parent.id === child.id) {
      parent.assignChild(child.id); // delegates to entity to throw TaskSelfReferenceError
    }

    if (await this.wouldCreateCycle(parent, child)) {
      throw new TaskCircularReferenceError();
    }

    parent.assignChild(child.id);
    child.assignParent(parent.id);

    const savedParent = await this.tasks.save(parent);
    const savedChild = await this.tasks.save(child);

    return { parent: savedParent, child: savedChild };
  }

  private async wouldCreateCycle(parent: Task, child: Task): Promise<boolean> {
    let current: Task | null = parent;
    while (current !== null) {
      if (current.id === child.id) return true;
      if (current.parentTaskId === undefined) break;
      current = await this.tasks.findById(current.parentTaskId);
    }
    return false;
  }
}
