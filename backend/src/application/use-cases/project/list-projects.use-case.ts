import { IProjectRepository } from '../../../domain/interfaces/project-repository.interface';
import { IListProjectsUseCase } from '../../interfaces/project/list-projects.use-case.interface';
import type { ListProjectsInput } from '../../types/inputs/project/list-projects.input';
import type { ListProjectsOutput } from '../../types/outputs/project/list-projects.output';

export class ListProjectsUseCase implements IListProjectsUseCase {
  constructor(private readonly projects: IProjectRepository) {}

  async execute(input: ListProjectsInput): Promise<ListProjectsOutput> {
    return this.projects.findWithQuery(input);
  }
}
