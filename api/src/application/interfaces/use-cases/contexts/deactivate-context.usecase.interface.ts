import {
  DeactivateContextInput,
  DeactivateContextOutput,
} from '../../../dtos/contexts/deactivate-context.dto';

export const IDeactivateContextUseCase = Symbol('IDeactivateContextUseCase');

export interface IDeactivateContextUseCase {
  execute(input: DeactivateContextInput): Promise<DeactivateContextOutput>;
}
