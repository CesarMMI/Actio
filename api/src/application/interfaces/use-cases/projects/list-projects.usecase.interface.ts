import {
  ListProjectsInput,
  ListProjectsOutput,
} from '../../../dtos/projects/list-projects.dto';

export const IListProjectsUseCase = Symbol('IListProjectsUseCase');

export interface IListProjectsUseCase {
  execute(input: ListProjectsInput): Promise<ListProjectsOutput>;
}
