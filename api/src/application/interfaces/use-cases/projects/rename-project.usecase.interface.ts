import {
  RenameProjectInput,
  RenameProjectOutput,
} from '../../../dtos/projects/rename-project.dto';

export const IRenameProjectUseCase = Symbol('IRenameProjectUseCase');

export interface IRenameProjectUseCase {
  execute(input: RenameProjectInput): Promise<RenameProjectOutput>;
}
