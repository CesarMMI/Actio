import { IProjectRepository } from '../../../domain/interfaces';
import { ProjectNotFoundError } from '../../errors/project-not-found.error';
import { IRenameProjectUseCase, RenameProjectInput } from '../../interfaces/project/rename-project.use-case.interface';

export class RenameProjectUseCase implements IRenameProjectUseCase {
  constructor(private readonly projects: IProjectRepository) {}

  async execute(input: RenameProjectInput): Promise<void> {
    const project = await this.projects.findById(input.projectId);
    if (!project) throw new ProjectNotFoundError(input.projectId);

    project.rename(input.name);
    await this.projects.save(project);
  }
}
