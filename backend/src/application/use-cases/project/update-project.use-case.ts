import { Project } from '../../../domain/entities/project.entity';
import { ProjectNotFoundError } from '../../../domain/errors/project-not-found.error';
import { ProjectTitleAlreadyExistsError } from '../../../domain/errors/project-title-already-exists.error';
import { IProjectRepository } from '../../../domain/interfaces/IProjectRepository';
import type { UpdateProjectInput } from '../../interfaces/project/update-project.input';

export class UpdateProjectUseCase {
  constructor(private readonly projects: IProjectRepository) {}

  async execute(input: UpdateProjectInput): Promise<Project> {
    const project = await this.projects.findById(input.id);
    if (!project) throw new ProjectNotFoundError(input.id);

    const existing = await this.projects.findByTitle(input.title);
    if (existing && existing.id !== input.id) throw new ProjectTitleAlreadyExistsError(input.title);

    project.rename(input.title);
    return this.projects.save(project);
  }
}
