import { Task } from '../../../domain/entities/task/task.entity';
import { ContextNotFoundError } from '../../../domain/errors/context/context-not-found.error';
import { ProjectNotFoundError } from '../../../domain/errors/project/project-not-found.error';
import { TaskNotFoundError } from '../../../domain/errors/task/task-not-found.error';
import { IContextRepository } from '../../../domain/interfaces/context-repository.interface';
import { IProjectRepository } from '../../../domain/interfaces/project-repository.interface';
import { ITaskRepository } from '../../../domain/interfaces/task-repository.interface';
import { IUpdateTaskUseCase } from '../../interfaces/task/update-task.use-case.interface';
import type { UpdateTaskInput } from '../../types/inputs/task/update-task.input';
import type { UpdateTaskOutput } from '../../types/outputs/task/update-task.output';

export class UpdateTaskUseCase implements IUpdateTaskUseCase {
  constructor(
    private readonly tasks: ITaskRepository,
    private readonly contexts: IContextRepository,
    private readonly projects: IProjectRepository,
  ) {}

  async execute(input: UpdateTaskInput): Promise<UpdateTaskOutput> {
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
