import { ActionStatus, EnergyLevel, TimeBucket } from '../enums';
import { ActionNotCompletedError, ActionNotOpenError } from '../errors';

export interface ActionProps {
  id: string;
  title: string;
  notes?: string;
  dueDate?: Date;
  timeBucket?: TimeBucket;
  energyLevel?: EnergyLevel;
  status: ActionStatus;
  projectId?: string;
  contextId?: string;
  createdAt: Date;
}

export class Action {
  readonly id: string;
  title: string;
  notes?: string;
  dueDate?: Date;
  timeBucket?: TimeBucket;
  energyLevel?: EnergyLevel;
  status: ActionStatus;
  projectId?: string;
  contextId?: string;
  readonly createdAt: Date;

  constructor(props: ActionProps) {
    this.id = props.id;
    this.title = props.title;
    this.notes = props.notes;
    this.dueDate = props.dueDate;
    this.timeBucket = props.timeBucket;
    this.energyLevel = props.energyLevel;
    this.status = props.status;
    this.projectId = props.projectId;
    this.contextId = props.contextId;
    this.createdAt = props.createdAt;
  }

  complete(): void {
    if (this.status !== ActionStatus.OPEN) {
      throw new ActionNotOpenError(this.id);
    }
    this.status = ActionStatus.COMPLETED;
  }

  archive(): void {
    if (this.status !== ActionStatus.COMPLETED) {
      throw new ActionNotCompletedError(this.id);
    }
    this.status = ActionStatus.ARCHIVED;
  }

  assignProject(projectId: string | null): void {
    this.projectId = projectId ?? undefined;
  }

  assignContext(contextId: string | null): void {
    this.contextId = contextId ?? undefined;
  }
}
