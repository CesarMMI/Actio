import { CapturedItem } from '../../../domain/entities/captured-item';

export interface QuickCaptureInput {
  title: string;
  notes?: string;
}

export interface IQuickCaptureUseCase {
  execute(input: QuickCaptureInput): Promise<CapturedItem>;
}
