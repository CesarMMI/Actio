import { Project } from '../../../domain/entities/project.entity';
import { ProjectNotFoundError } from '../../../domain/errors/project-not-found.error';
import { IProjectRepository } from '../../../domain/interfaces/IProjectRepository';
import type { GetProjectInput } from '../../interfaces/project/get-project.input';

export class GetProjectUseCase {
  constructor(private readonly projects: IProjectRepository) {}

  async execute(input: GetProjectInput): Promise<Project> {
    const project = await this.projects.findById(input.id);
    if (!project) throw new ProjectNotFoundError(input.id);
    return project;
  }
}
