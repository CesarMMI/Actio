import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { IActionRepository } from '../../../domain/interfaces/repositories/action-repository.interface';
import { IProjectRepository } from '../../../domain/interfaces/repositories/project-repository.interface';
import {
  AssignActionToProjectInput,
  AssignActionToProjectOutput,
} from '../../dtos/actions/assign-action-to-project.dto';
import { toActionDto } from '../../mappers/action.mapper';
import { IAssignActionToProjectUseCase } from '../../interfaces/use-cases/actions/assign-action-to-project.usecase.interface';

@Injectable()
export class AssignActionToProjectUseCase implements IAssignActionToProjectUseCase {
  constructor(
    @Inject(IActionRepository) private readonly actions: IActionRepository,
    @Inject(IProjectRepository) private readonly projects: IProjectRepository,
  ) {}

  async execute(
    input: AssignActionToProjectInput,
  ): Promise<AssignActionToProjectOutput> {
    const action = await this.actions.findByIdForUser(
      input.userId,
      input.actionId,
    );
    if (!action) throw new EntityNotFoundError('Action', input.actionId);

    if (input.projectId) {
      const project = await this.projects.findByIdForUser(
        input.userId,
        input.projectId,
      );
      if (!project) throw new EntityNotFoundError('Project', input.projectId);
    }

    action.assignProject(input.projectId);
    const saved = await this.actions.saveForUser(input.userId, action);
    return { action: toActionDto(saved) };
  }
}
