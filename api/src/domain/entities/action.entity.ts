import { InvalidStatusTransitionError } from '../errors/invalid-status-transition.error';
import { EnergyLevel } from '../value-objects/energy-level.value-object';
import { TimeBucket } from '../value-objects/time-bucket.value-object';
import { Title } from '../value-objects/title.value-object';
import { ActionStatus } from '../enums/action-status';

export class Action {
  private status: ActionStatus = 'OPEN';
  private completedAt: Date | null = null;

  private constructor(
    readonly id: string,
    readonly title: Title,
    readonly notes: string | undefined,
    readonly dueDate: Date | null,
    readonly timeBucket: TimeBucket | null,
    readonly energyLevel: EnergyLevel | null,
    private projectId: string | null,
    private contextId: string | null,
  ) {}

  static create(params: {
    id: string;
    title: Title;
    notes?: string;
    dueDate?: Date | null;
    timeBucket?: TimeBucket | null;
    energyLevel?: EnergyLevel | null;
    projectId?: string | null;
    contextId?: string | null;
  }): Action {
    return new Action(
      params.id,
      params.title,
      params.notes,
      params.dueDate ?? null,
      params.timeBucket ?? null,
      params.energyLevel ?? null,
      params.projectId ?? null,
      params.contextId ?? null,
    );
  }

  getStatus(): ActionStatus {
    return this.status;
  }

  getProjectId(): string | null {
    return this.projectId;
  }

  getContextId(): string | null {
    return this.contextId;
  }

  assignProject(projectId: string | null): void {
    this.projectId = projectId;
  }

  assignContext(contextId: string | null): void {
    this.contextId = contextId;
  }

  complete(): void {
    if (this.status !== 'OPEN') {
      throw new InvalidStatusTransitionError(
        'Action',
        this.status,
        'COMPLETED',
      );
    }
    this.status = 'COMPLETED';
    this.completedAt = new Date();
  }

  archive(): void {
    if (this.status !== 'COMPLETED') {
      throw new InvalidStatusTransitionError('Action', this.status, 'ARCHIVED');
    }
    this.status = 'ARCHIVED';
  }
}
