import { Action } from '../entities/action';
import { ActionStatus, EnergyLevel, TimeBucket } from '../enums';

export interface ActionFilters {
  contextId?: string;
  projectId?: string;
  timeBucket?: TimeBucket;
  energyLevel?: EnergyLevel;
  dueBefore?: Date;
  status?: ActionStatus;
}

export interface IActionRepository {
  save(action: Action): Promise<void>;
  findById(id: string): Promise<Action | null>;
  findByFilters(filters: ActionFilters): Promise<Action[]>;
  countOpenByProjectId(projectId: string): Promise<number>;
}
