import { Action } from '../../../domain/entities/action';
import { TimeBucket, EnergyLevel } from '../../../domain/enums';

export interface ClarifyAsActionInput {
  capturedItemId: string;
  actionTitle: string;
  actionNotes?: string;
  dueDate?: Date;
  timeBucket?: TimeBucket;
  energyLevel?: EnergyLevel;
  projectId?: string;
  contextId?: string;
}

export interface IClarifyAsActionUseCase {
  execute(input: ClarifyAsActionInput): Promise<Action>;
}
