import {
  AssignActionToProjectInput,
  AssignActionToProjectOutput,
} from '../../../dtos/actions/assign-action-to-project.dto';

export const IAssignActionToProjectUseCase = Symbol(
  'IAssignActionToProjectUseCase',
);

export interface IAssignActionToProjectUseCase {
  execute(
    input: AssignActionToProjectInput,
  ): Promise<AssignActionToProjectOutput>;
}
