import {
  ArchiveProjectInput,
  ArchiveProjectOutput,
} from '../../../dtos/projects/archive-project.dto';

export const IArchiveProjectUseCase = Symbol('IArchiveProjectUseCase');

export interface IArchiveProjectUseCase {
  execute(input: ArchiveProjectInput): Promise<ArchiveProjectOutput>;
}
