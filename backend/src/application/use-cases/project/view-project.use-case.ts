import { IProjectRepository, IActionRepository } from '../../../domain/interfaces';
import { ProjectNotFoundError } from '../../errors/project-not-found.error';
import { IViewProjectUseCase, ViewProjectOutput } from '../../interfaces/project/view-project.use-case.interface';

export class ViewProjectUseCase implements IViewProjectUseCase {
  constructor(
    private readonly projects: IProjectRepository,
    private readonly actions: IActionRepository,
  ) {}

  async execute(projectId: string): Promise<ViewProjectOutput> {
    const project = await this.projects.findById(projectId);
    if (!project) throw new ProjectNotFoundError(projectId);

    const actions = await this.actions.findByFilters({ projectId });

    return { project, actions };
  }
}
