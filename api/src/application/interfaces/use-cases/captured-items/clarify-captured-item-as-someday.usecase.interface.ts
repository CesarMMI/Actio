import {
  ClarifyCapturedItemTerminalInput,
  ClarifyCapturedItemTerminalOutput,
} from '../../../dtos/captured-items/clarify-terminal.dto';

export const IClarifyCapturedItemAsSomedayUseCase = Symbol(
  'IClarifyCapturedItemAsSomedayUseCase',
);

export interface IClarifyCapturedItemAsSomedayUseCase {
  execute(
    input: ClarifyCapturedItemTerminalInput,
  ): Promise<ClarifyCapturedItemTerminalOutput>;
}
