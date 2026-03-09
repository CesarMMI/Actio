import {
  CompleteActionInput,
  CompleteActionOutput,
} from '../../../dtos/actions/complete-action.dto';

export const ICompleteActionUseCase = Symbol('ICompleteActionUseCase');

export interface ICompleteActionUseCase {
  execute(input: CompleteActionInput): Promise<CompleteActionOutput>;
}
