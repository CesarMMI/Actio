import { ProjectHasTasksError } from '../../../domain/errors/project/project-has-tasks.error';
import { ProjectNotFoundError } from '../../../domain/errors/project/project-not-found.error';
import { IProjectRepository } from '../../../domain/interfaces/project-repository.interface';
import { ITaskRepository } from '../../../domain/interfaces/task-repository.interface';
import { IDeleteProjectUseCase } from '../../interfaces/project/delete-project.use-case.interface';
import type { DeleteProjectInput } from '../../types/inputs/project/delete-project.input';
import type { DeleteProjectOutput } from '../../types/outputs/project/delete-project.output';

export class DeleteProjectUseCase implements IDeleteProjectUseCase {
  constructor(
    private readonly projects: IProjectRepository,
    private readonly tasks: ITaskRepository,
  ) {}

  async execute(input: DeleteProjectInput): Promise<DeleteProjectOutput> {
    const project = await this.projects.findById(input.id);
    if (!project) throw new ProjectNotFoundError(input.id);

    const referencingTasks = await this.tasks.findByProjectId(input.id);
    if (referencingTasks.length > 0) throw new ProjectHasTasksError(input.id);

    await this.projects.delete(input.id);
  }
}
