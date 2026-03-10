import { ProjectNotFoundError } from '../../../domain/errors/project/project-not-found.error';
import { IProjectRepository } from '../../../domain/interfaces/project-repository.interface';
import { IGetProjectUseCase } from '../../interfaces/project/get-project.use-case.interface';
import type { GetProjectInput } from '../../types/inputs/project/get-project.input';
import type { GetProjectOutput } from '../../types/outputs/project/get-project.output';

export class GetProjectUseCase implements IGetProjectUseCase {
  constructor(private readonly projects: IProjectRepository) {}

  async execute(input: GetProjectInput): Promise<GetProjectOutput> {
    const project = await this.projects.findById(input.id);
    if (!project) throw new ProjectNotFoundError(input.id);
    return project;
  }
}
