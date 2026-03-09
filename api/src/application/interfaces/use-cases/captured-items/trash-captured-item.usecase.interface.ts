import {
  ClarifyCapturedItemTerminalInput,
  ClarifyCapturedItemTerminalOutput,
} from '../../../dtos/captured-items/clarify-terminal.dto';

export const ITrashCapturedItemUseCase = Symbol('ITrashCapturedItemUseCase');

export interface ITrashCapturedItemUseCase {
  execute(
    input: ClarifyCapturedItemTerminalInput,
  ): Promise<ClarifyCapturedItemTerminalOutput>;
}
