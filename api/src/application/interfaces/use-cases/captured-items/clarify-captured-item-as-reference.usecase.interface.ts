import {
  ClarifyCapturedItemTerminalInput,
  ClarifyCapturedItemTerminalOutput,
} from '../../../dtos/captured-items/clarify-terminal.dto';

export const IClarifyCapturedItemAsReferenceUseCase = Symbol(
  'IClarifyCapturedItemAsReferenceUseCase',
);

export interface IClarifyCapturedItemAsReferenceUseCase {
  execute(
    input: ClarifyCapturedItemTerminalInput,
  ): Promise<ClarifyCapturedItemTerminalOutput>;
}
