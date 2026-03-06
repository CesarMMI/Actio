import { Action } from '../../../domain/entities/action.entity';
import { ActionOrmEntity } from '../orm-entities/action.orm-entity';
import { Title } from '../../../domain/value-objects/title.value-object';
import { EnergyLevel } from '../../../domain/value-objects/energy-level.value-object';
import { TimeBucket } from '../../../domain/value-objects/time-bucket.value-object';
import { ActionStatus } from '../../../domain/enums/action-status';

export function toDomain(orm: ActionOrmEntity): Action {
  const action = Action.create({
    id: orm.id,
    title: Title.create(orm.title),
    notes: orm.notes || undefined,
    dueDate: orm.dueDate,
    timeBucket: orm.timeBucket ? TimeBucket.create(orm.timeBucket) : null,
    energyLevel: orm.energyLevel
      ? EnergyLevel.create(orm.energyLevel as 'LOW' | 'MEDIUM' | 'HIGH')
      : null,
    projectId: orm.projectId,
    contextId: orm.contextId,
  });

  // Override private properties mapped by typeorm
  action['status'] = orm.status as ActionStatus;
  action['completedAt'] = orm.completedAt;

  return action;
}

export function toPersistence(domain: Action, userId: string): ActionOrmEntity {
  const orm = new ActionOrmEntity();
  orm.id = domain.id;
  orm.userId = userId;
  orm.title = domain.title.getValue();
  orm.notes = domain['notes'] || null;
  orm.dueDate = domain['dueDate'] || null;
  orm.timeBucket = domain['timeBucket']
    ? domain['timeBucket'].getValue()
    : null;
  orm.energyLevel = domain['energyLevel']
    ? domain['energyLevel'].getValue()
    : null;
  orm.projectId = domain.getProjectId();
  orm.contextId = domain.getContextId();
  orm.status = domain.getStatus();
  orm.completedAt = domain['completedAt'] || null;
  return orm;
}
