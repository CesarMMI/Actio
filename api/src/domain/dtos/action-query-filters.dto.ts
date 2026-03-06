import { EnergyLevel } from 'src/domain/value-objects/energy-level.value-object';
import { TimeBucket } from 'src/domain/value-objects/time-bucket.value-object';

export type ActionQueryFiltersDto = {
  timeBucket?: TimeBucket;
  energyLevel?: EnergyLevel;
  dueFrom?: Date;
  dueTo?: Date;
};
