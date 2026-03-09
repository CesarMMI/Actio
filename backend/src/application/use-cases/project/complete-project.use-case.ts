import { IProjectRepository, IActionRepository } from '../../../domain/interfaces';
import { ProjectNotFoundError } from '../../errors/project-not-found.error';
import { ICompleteProjectUseCase } from '../../interfaces/project/complete-project.use-case.interface';

export class CompleteProjectUseCase implements ICompleteProjectUseCase {
  constructor(
    private readonly projects: IProjectRepository,
    private readonly actions: IActionRepository,
  ) {}

  async execute(projectId: string): Promise<void> {
    const project = await this.projects.findById(projectId);
    if (!project) throw new ProjectNotFoundError(projectId);

    const openCount = await this.actions.countOpenByProjectId(projectId);
    project.complete(openCount);
    await this.projects.save(project);
  }
}
