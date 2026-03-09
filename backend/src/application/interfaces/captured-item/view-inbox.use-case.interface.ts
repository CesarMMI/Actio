import { CapturedItem } from '../../../domain/entities/captured-item';

export interface IViewInboxUseCase {
  execute(): Promise<CapturedItem[]>;
}
