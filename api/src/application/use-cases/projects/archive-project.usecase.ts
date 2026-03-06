import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { IProjectRepository } from '../../../domain/interfaces/repositories/project-repository.interface';
import {
  ArchiveProjectInput,
  ArchiveProjectOutput,
} from '../../dtos/projects/archive-project.dto';
import { toProjectDto } from '../../mappers/project.mapper';

export class ArchiveProjectUseCase {
  constructor(private readonly projects: IProjectRepository) { }

  async execute(input: ArchiveProjectInput): Promise<ArchiveProjectOutput> {
    const project = await this.projects.findByIdForUser(input.userId, input.projectId);
    if (!project) throw new EntityNotFoundError('Project', input.projectId);

    project.archive();
    const saved = await this.projects.saveForUser(input.userId, project);
    return { project: toProjectDto(saved) };
  }
}
