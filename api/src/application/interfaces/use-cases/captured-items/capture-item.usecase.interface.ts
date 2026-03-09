import {
  CaptureItemInput,
  CaptureItemOutput,
} from '../../../dtos/captured-items/capture-item.dto';

export const ICaptureItemUseCase = Symbol('ICaptureItemUseCase');

export interface ICaptureItemUseCase {
  execute(input: CaptureItemInput): Promise<CaptureItemOutput>;
}
