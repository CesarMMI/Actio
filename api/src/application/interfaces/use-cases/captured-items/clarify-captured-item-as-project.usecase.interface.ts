import {
  ClarifyCapturedItemAsProjectInput,
  ClarifyCapturedItemAsProjectOutput,
} from '../../../dtos/captured-items/clarify-as-project.dto';

export const IClarifyCapturedItemAsProjectUseCase = Symbol(
  'IClarifyCapturedItemAsProjectUseCase',
);

export interface IClarifyCapturedItemAsProjectUseCase {
  execute(
    input: ClarifyCapturedItemAsProjectInput,
  ): Promise<ClarifyCapturedItemAsProjectOutput>;
}
