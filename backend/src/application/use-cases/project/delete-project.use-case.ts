import { ProjectHasTasksError } from '../../../domain/errors/project-has-tasks.error';
import { ProjectNotFoundError } from '../../../domain/errors/project-not-found.error';
import { IProjectRepository } from '../../../domain/interfaces/IProjectRepository';
import { ITaskRepository } from '../../../domain/interfaces/ITaskRepository';
import type { DeleteProjectInput } from '../../interfaces/project/delete-project.input';

export class DeleteProjectUseCase {
  constructor(
    private readonly projects: IProjectRepository,
    private readonly tasks: ITaskRepository,
  ) {}

  async execute(input: DeleteProjectInput): Promise<void> {
    const project = await this.projects.findById(input.id);
    if (!project) throw new ProjectNotFoundError(input.id);

    const referencingTasks = await this.tasks.findByProjectId(input.id);
    if (referencingTasks.length > 0) throw new ProjectHasTasksError(input.id);

    await this.projects.delete(input.id);
  }
}
