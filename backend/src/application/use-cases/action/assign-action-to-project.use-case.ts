import { IActionRepository, IProjectRepository } from '../../../domain/interfaces';
import { ActionNotFoundError } from '../../errors/action-not-found.error';
import { ProjectNotFoundError } from '../../errors/project-not-found.error';
import { IAssignActionToProjectUseCase, AssignActionToProjectInput } from '../../interfaces/action/assign-action-to-project.use-case.interface';

export class AssignActionToProjectUseCase implements IAssignActionToProjectUseCase {
  constructor(
    private readonly actions: IActionRepository,
    private readonly projects: IProjectRepository,
  ) {}

  async execute(input: AssignActionToProjectInput): Promise<void> {
    const action = await this.actions.findById(input.actionId);
    if (!action) throw new ActionNotFoundError(input.actionId);

    if (input.projectId !== null) {
      const project = await this.projects.findById(input.projectId);
      if (!project) throw new ProjectNotFoundError(input.projectId);
    }

    action.assignProject(input.projectId);
    await this.actions.save(action);
  }
}
