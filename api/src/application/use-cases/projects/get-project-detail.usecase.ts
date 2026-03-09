import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { IActionRepository } from '../../../domain/interfaces/repositories/action-repository.interface';
import { IProjectRepository } from '../../../domain/interfaces/repositories/project-repository.interface';
import {
  GetProjectDetailInput,
  GetProjectDetailOutput,
} from '../../dtos/projects/get-project-detail.dto';
import { toActionDto } from '../../mappers/action.mapper';
import { toProjectDto } from '../../mappers/project.mapper';
import { IGetProjectDetailUseCase } from '../../interfaces/use-cases/projects/get-project-detail.usecase.interface';

@Injectable()
export class GetProjectDetailUseCase implements IGetProjectDetailUseCase {
  constructor(
    @Inject(IProjectRepository) private readonly projects: IProjectRepository,
    @Inject(IActionRepository) private readonly actions: IActionRepository,
  ) {}

  async execute(input: GetProjectDetailInput): Promise<GetProjectDetailOutput> {
    const project = await this.projects.findByIdForUser(
      input.userId,
      input.projectId,
    );
    if (!project) throw new EntityNotFoundError('Project', input.projectId);

    const actions = await this.actions.findByProject(
      input.userId,
      input.projectId,
    );
    const open = actions.filter((a) => a.getStatus() === 'OPEN');
    const done = actions.filter((a) => a.getStatus() !== 'OPEN');

    return {
      project: toProjectDto(project),
      openActions: open.map(toActionDto),
      completedActions: done.map(toActionDto),
    };
  }
}
