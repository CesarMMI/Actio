import {
  AssignActionToContextInput,
  AssignActionToContextOutput,
} from '../../../dtos/actions/assign-action-to-context.dto';

export const IAssignActionToContextUseCase = Symbol(
  'IAssignActionToContextUseCase',
);

export interface IAssignActionToContextUseCase {
  execute(
    input: AssignActionToContextInput,
  ): Promise<AssignActionToContextOutput>;
}
