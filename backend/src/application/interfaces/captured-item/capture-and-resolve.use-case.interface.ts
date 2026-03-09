import { CapturedItem } from '../../../domain/entities/captured-item';
import { Action } from '../../../domain/entities/action';
import { TimeBucket, EnergyLevel } from '../../../domain/enums';

export interface CaptureAndResolveInput {
  title: string;
  notes?: string;
  actionTitle: string;
  actionNotes?: string;
  dueDate?: Date;
  timeBucket?: TimeBucket;
  energyLevel?: EnergyLevel;
  projectId?: string;
  contextId?: string;
}

export interface CaptureAndResolveOutput {
  capturedItem: CapturedItem;
  action: Action;
}

export interface ICaptureAndResolveUseCase {
  execute(input: CaptureAndResolveInput): Promise<CaptureAndResolveOutput>;
}
