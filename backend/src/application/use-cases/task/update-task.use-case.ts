import { Task } from '../../../domain/entities/task.entity';
import { ContextNotFoundError } from '../../../domain/errors/context-not-found.error';
import { ProjectNotFoundError } from '../../../domain/errors/project-not-found.error';
import { TaskNotFoundError } from '../../../domain/errors/task-not-found.error';
import { IContextRepository } from '../../../domain/interfaces/IContextRepository';
import { IProjectRepository } from '../../../domain/interfaces/IProjectRepository';
import { ITaskRepository } from '../../../domain/interfaces/ITaskRepository';
import type { UpdateTaskInput } from '../../interfaces/task/update-task.input';

export class UpdateTaskUseCase {
  constructor(
    private readonly tasks: ITaskRepository,
    private readonly contexts: IContextRepository,
    private readonly projects: IProjectRepository,
  ) {}

  async execute(input: UpdateTaskInput): Promise<Task> {
    const task = await this.tasks.findById(input.id);
    if (!task) throw new TaskNotFoundError(input.id);

    if (input.description !== undefined) {
      task.updateDescription(input.description);
    }

    if (input.contextId !== undefined) {
      if (input.contextId !== null) {
        const context = await this.contexts.findById(input.contextId);
        if (!context) throw new ContextNotFoundError(input.contextId);
      }
      task.assignContext(input.contextId);
    }

    if (input.projectId !== undefined) {
      if (input.projectId !== null) {
        const project = await this.projects.findById(input.projectId);
        if (!project) throw new ProjectNotFoundError(input.projectId);
      }
      task.assignProject(input.projectId);
    }

    return this.tasks.save(task);
  }
}
