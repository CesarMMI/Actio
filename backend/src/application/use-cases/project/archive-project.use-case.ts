import { IProjectRepository } from '../../../domain/interfaces';
import { ProjectNotFoundError } from '../../errors/project-not-found.error';
import { IArchiveProjectUseCase } from '../../interfaces/project/archive-project.use-case.interface';

export class ArchiveProjectUseCase implements IArchiveProjectUseCase {
  constructor(private readonly projects: IProjectRepository) {}

  async execute(projectId: string): Promise<void> {
    const project = await this.projects.findById(projectId);
    if (!project) throw new ProjectNotFoundError(projectId);

    project.archive();
    await this.projects.save(project);
  }
}
