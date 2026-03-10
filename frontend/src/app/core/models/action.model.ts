export type ActionStatus = 'OPEN' | 'COMPLETED' | 'ARCHIVED';
export type TimeBucket = 'short' | 'medium' | 'long';
export type EnergyLevel = 'low' | 'medium' | 'high';

export interface Action {
  id: string;
  title: string;
  notes?: string;
  dueDate?: string;
  timeBucket?: TimeBucket;
  energyLevel?: EnergyLevel;
  status: ActionStatus;
  projectId?: string;
  contextId?: string;
  createdAt: string;
}
