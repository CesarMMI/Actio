import { Task } from '../../../domain/entities/task.entity';
import { ContextNotFoundError } from '../../../domain/errors/context-not-found.error';
import { ProjectNotFoundError } from '../../../domain/errors/project-not-found.error';
import { TaskAlreadyHasChildError } from '../../../domain/errors/task-already-has-child.error';
import { TaskNotFoundError } from '../../../domain/errors/task-not-found.error';
import { IContextRepository } from '../../../domain/interfaces/IContextRepository';
import { IProjectRepository } from '../../../domain/interfaces/IProjectRepository';
import { ITaskRepository } from '../../../domain/interfaces/ITaskRepository';
import type { CreateTaskInput } from '../../interfaces/task/create-task.input';

export class CreateTaskUseCase {
  constructor(
    private readonly tasks: ITaskRepository,
    private readonly contexts: IContextRepository,
    private readonly projects: IProjectRepository,
  ) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    if (input.contextId !== undefined) {
      const context = await this.contexts.findById(input.contextId);
      if (!context) throw new ContextNotFoundError(input.contextId);
    }

    if (input.projectId !== undefined) {
      const project = await this.projects.findById(input.projectId);
      if (!project) throw new ProjectNotFoundError(input.projectId);
    }

    let parent: Task | null = null;
    if (input.parentTaskId !== undefined) {
      parent = await this.tasks.findById(input.parentTaskId);
      if (!parent) throw new TaskNotFoundError(input.parentTaskId);
      if (parent.childTaskId !== undefined) throw new TaskAlreadyHasChildError(parent.id);
    }

    const task = Task.create(input);

    if (parent) {
      parent.assignChild(task.id);
      await this.tasks.save(parent);
    }

    return this.tasks.save(task);
  }
}
