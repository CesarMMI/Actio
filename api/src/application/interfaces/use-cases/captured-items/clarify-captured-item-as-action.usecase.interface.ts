import {
  ClarifyCapturedItemAsActionInput,
  ClarifyCapturedItemAsActionOutput,
} from '../../../dtos/captured-items/clarify-as-action.dto';

export const IClarifyCapturedItemAsActionUseCase = Symbol(
  'IClarifyCapturedItemAsActionUseCase',
);

export interface IClarifyCapturedItemAsActionUseCase {
  execute(
    input: ClarifyCapturedItemAsActionInput,
  ): Promise<ClarifyCapturedItemAsActionOutput>;
}
