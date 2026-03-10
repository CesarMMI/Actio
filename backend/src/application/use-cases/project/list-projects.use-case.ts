import { Project } from '../../../domain/entities/project.entity';
import { IProjectRepository } from '../../../domain/interfaces/IProjectRepository';

export class ListProjectsUseCase {
  constructor(private readonly projects: IProjectRepository) {}

  async execute(): Promise<Project[]> {
    return this.projects.findAll();
  }
}
