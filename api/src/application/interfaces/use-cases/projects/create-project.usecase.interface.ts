import {
  CreateProjectInput,
  CreateProjectOutput,
} from '../../../dtos/projects/create-project.dto';

export const ICreateProjectUseCase = Symbol('ICreateProjectUseCase');

export interface ICreateProjectUseCase {
  execute(input: CreateProjectInput): Promise<CreateProjectOutput>;
}
