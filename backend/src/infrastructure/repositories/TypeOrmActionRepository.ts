import { DataSource, Repository } from 'typeorm';
import { Action } from '../../domain/entities/action';
import { ActionStatus, EnergyLevel, TimeBucket } from '../../domain/enums';
import { ActionFilters, IActionRepository } from '../../domain/interfaces';
import { ActionOrmEntity } from '../entities/ActionOrmEntity';

export class TypeOrmActionRepository implements IActionRepository {
  private readonly repo: Repository<ActionOrmEntity>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(ActionOrmEntity);
  }

  async save(action: Action): Promise<void> {
    await this.repo.save(this.toOrm(action));
  }

  async findById(id: string): Promise<Action | null> {
    const entity = await this.repo.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async findByFilters(filters: ActionFilters): Promise<Action[]> {
    const qb = this.repo.createQueryBuilder('action');

    if (filters.contextId !== undefined) {
      qb.andWhere('action.contextId = :contextId', { contextId: filters.contextId });
    }
    if (filters.projectId !== undefined) {
      qb.andWhere('action.projectId = :projectId', { projectId: filters.projectId });
    }
    if (filters.timeBucket !== undefined) {
      qb.andWhere('action.timeBucket = :timeBucket', { timeBucket: filters.timeBucket });
    }
    if (filters.energyLevel !== undefined) {
      qb.andWhere('action.energyLevel = :energyLevel', { energyLevel: filters.energyLevel });
    }
    if (filters.dueBefore !== undefined) {
      qb.andWhere('action.dueDate < :dueBefore', { dueBefore: filters.dueBefore });
    }
    if (filters.status !== undefined) {
      qb.andWhere('action.status = :status', { status: filters.status });
    }

    const entities = await qb.getMany();
    return entities.map(e => this.toDomain(e));
  }

  async countOpenByProjectId(projectId: string): Promise<number> {
    return this.repo.countBy({ projectId, status: ActionStatus.OPEN });
  }

  private toDomain(entity: ActionOrmEntity): Action {
    return new Action({
      id: entity.id,
      title: entity.title,
      notes: entity.notes ?? undefined,
      dueDate: entity.dueDate ?? undefined,
      timeBucket: entity.timeBucket ? (entity.timeBucket as TimeBucket) : undefined,
      energyLevel: entity.energyLevel ? (entity.energyLevel as EnergyLevel) : undefined,
      status: entity.status as ActionStatus,
      projectId: entity.projectId ?? undefined,
      contextId: entity.contextId ?? undefined,
      createdAt: entity.createdAt,
    });
  }

  private toOrm(action: Action): ActionOrmEntity {
    const entity = new ActionOrmEntity();
    entity.id = action.id;
    entity.title = action.title;
    entity.notes = action.notes ?? null;
    entity.dueDate = action.dueDate ?? null;
    entity.timeBucket = action.timeBucket ?? null;
    entity.energyLevel = action.energyLevel ?? null;
    entity.status = action.status;
    entity.projectId = action.projectId ?? null;
    entity.contextId = action.contextId ?? null;
    entity.createdAt = action.createdAt;
    return entity;
  }
}
