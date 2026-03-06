import { ActionStatus } from '../../../domain/enums/action-status';
import { EnergyLevelValue } from '../../../domain/value-objects/energy-level.value-object';
import { TimeBucketValue } from '../../../domain/value-objects/time-bucket.value-object';

export type ActionDto = {
  id: string;
  title: string;
  notes?: string;
  dueDate: string | null;
  timeBucket: TimeBucketValue | null;
  energyLevel: EnergyLevelValue | null;
  projectId: string | null;
  contextId: string | null;
  status: ActionStatus;
};
