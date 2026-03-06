import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { IProjectRepository } from '../../../domain/interfaces/repositories/project-repository.interface';
import {
  RenameProjectInput,
  RenameProjectOutput,
} from '../../dtos/projects/rename-project.dto';
import { toProjectDto } from '../../mappers/project.mapper';

export class RenameProjectUseCase {
  constructor(private readonly projects: IProjectRepository) { }

  async execute(input: RenameProjectInput): Promise<RenameProjectOutput> {
    const project = await this.projects.findByIdForUser(input.userId, input.projectId);
    if (!project) throw new EntityNotFoundError('Project', input.projectId);

    project.rename(input.name);
    const saved = await this.projects.saveForUser(input.userId, project);
    return { project: toProjectDto(saved) };
  }
}
