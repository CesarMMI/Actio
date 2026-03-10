import { Project } from '../../../domain/entities/project.entity';
import { ProjectTitleAlreadyExistsError } from '../../../domain/errors/project-title-already-exists.error';
import { IProjectRepository } from '../../../domain/interfaces/IProjectRepository';
import type { CreateProjectInput } from '../../interfaces/project/create-project.input';

export class CreateProjectUseCase {
  constructor(private readonly projects: IProjectRepository) {}

  async execute(input: CreateProjectInput): Promise<Project> {
    const existing = await this.projects.findByTitle(input.title);
    if (existing) throw new ProjectTitleAlreadyExistsError(input.title);

    const project = Project.create(input);
    return this.projects.save(project);
  }
}
