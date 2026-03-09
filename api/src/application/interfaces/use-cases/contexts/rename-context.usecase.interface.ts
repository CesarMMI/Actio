import {
  RenameContextInput,
  RenameContextOutput,
} from '../../../dtos/contexts/rename-context.dto';

export const IRenameContextUseCase = Symbol('IRenameContextUseCase');

export interface IRenameContextUseCase {
  execute(input: RenameContextInput): Promise<RenameContextOutput>;
}
