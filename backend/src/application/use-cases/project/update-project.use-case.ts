import { ProjectNotFoundError } from '../../../domain/errors/project/project-not-found.error';
import { ProjectTitleAlreadyExistsError } from '../../../domain/errors/project/project-title-already-exists.error';
import { IProjectRepository } from '../../../domain/interfaces/project-repository.interface';
import { IUpdateProjectUseCase } from '../../interfaces/project/update-project.use-case.interface';
import type { UpdateProjectInput } from '../../types/inputs/project/update-project.input';
import type { UpdateProjectOutput } from '../../types/outputs/project/update-project.output';

export class UpdateProjectUseCase implements IUpdateProjectUseCase {
  constructor(private readonly projects: IProjectRepository) {}

  async execute(input: UpdateProjectInput): Promise<UpdateProjectOutput> {
    const project = await this.projects.findById(input.id);
    if (!project) throw new ProjectNotFoundError(input.id);

    const existing = await this.projects.findByTitle(input.title);
    if (existing && existing.id !== input.id) throw new ProjectTitleAlreadyExistsError(input.title);

    project.rename(input.title);
    return this.projects.save(project);
  }
}
