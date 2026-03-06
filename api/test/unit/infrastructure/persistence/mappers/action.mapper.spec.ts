import { Action } from '../../../../../src/domain/entities/action.entity';
import { EnergyLevel } from '../../../../../src/domain/value-objects/energy-level.value-object';
import { TimeBucket } from '../../../../../src/domain/value-objects/time-bucket.value-object';
import { Title } from '../../../../../src/domain/value-objects/title.value-object';
import {
  toDomain,
  toPersistence,
} from '../../../../../src/infrastructure/persistence/mappers/action.mapper';

describe('ActionMapper', () => {
  it('should map full domain entity to ORM entity and back', () => {
    const dueDate = new Date('2025-12-31T23:59:59Z');

    const domain = Action.create({
      id: 'act123',
      title: Title.create('Write Report'),
      notes: 'Draft the Q3 report',
      dueDate,
      timeBucket: TimeBucket.create('medium'),
      energyLevel: EnergyLevel.create('high'),
      projectId: 'prj123',
      contextId: 'ctx123',
    });

    domain.complete(); // status open -> completed

    const userId = 'usr123';
    const orm = toPersistence(domain, userId);

    expect(orm.id).toBe('act123');
    expect(orm.userId).toBe('usr123');
    expect(orm.title).toBe('Write Report');
    expect(orm.notes).toBe('Draft the Q3 report');
    expect(orm.dueDate).toEqual(dueDate);
    expect(orm.timeBucket).toBe('medium');
    expect(orm.energyLevel).toBe('high');
    expect(orm.projectId).toBe('prj123');
    expect(orm.contextId).toBe('ctx123');
    expect(orm.status).toBe('COMPLETED');
    expect(orm.completedAt).toBeInstanceOf(Date);

    const restored = toDomain(orm);

    expect(restored.id).toBe('act123');
    expect(restored.title.getValue()).toBe('Write Report');
    expect(restored['notes']).toBe('Draft the Q3 report');
    expect(restored['dueDate']).toEqual(dueDate);
    expect(restored['timeBucket']?.getValue()).toBe('medium');
    expect(restored['energyLevel']?.getValue()).toBe('high');
    expect(restored.getProjectId()).toBe('prj123');
    expect(restored.getContextId()).toBe('ctx123');
    expect(restored.getStatus()).toBe('COMPLETED');
    expect(restored['completedAt']).toBeInstanceOf(Date);
  });

  it('should map minimal domain entity correctly', () => {
    const domain = Action.create({
      id: 'act456',
      title: Title.create('Quick task'),
    });

    const orm = toPersistence(domain, 'usr123');

    expect(orm.notes).toBeNull();
    expect(orm.dueDate).toBeNull();
    expect(orm.timeBucket).toBeNull();
    expect(orm.energyLevel).toBeNull();
    expect(orm.projectId).toBeNull();
    expect(orm.contextId).toBeNull();
    expect(orm.completedAt).toBeNull();
    expect(orm.status).toBe('OPEN');

    const restored = toDomain(orm);

    expect(restored['notes']).toBeUndefined();
    expect(restored['dueDate']).toBeNull();
    expect(restored['timeBucket']).toBeNull();
  });
});
