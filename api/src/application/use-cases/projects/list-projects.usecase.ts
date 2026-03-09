import { Inject, Injectable } from '@nestjs/common';
import { IActionRepository } from '../../../domain/interfaces/repositories/action-repository.interface';
import { IProjectRepository } from '../../../domain/interfaces/repositories/project-repository.interface';
import {
  ListProjectsInput,
  ListProjectsOutput,
} from '../../dtos/projects/list-projects.dto';
import { IListProjectsUseCase } from '../../interfaces/use-cases/projects/list-projects.usecase.interface';

@Injectable()
export class ListProjectsUseCase implements IListProjectsUseCase {
  constructor(
    @Inject(IProjectRepository) private readonly projects: IProjectRepository,
    @Inject(IActionRepository) private readonly actions: IActionRepository,
  ) {}

  async execute(input: ListProjectsInput): Promise<ListProjectsOutput> {
    const projects = await this.projects.findAllByUser(input.userId);

    const summaries = await Promise.all(
      projects.map(async (p) => {
        const actions = await this.actions.findByProject(input.userId, p.id);
        const openActionCount = actions.filter(
          (a) => a.getStatus() === 'OPEN',
        ).length;
        return {
          id: p.id,
          name: p.getName(),
          description: p.description,
          status: p.getStatus(),
          openActionCount,
        };
      }),
    );

    return { projects: summaries };
  }
}
