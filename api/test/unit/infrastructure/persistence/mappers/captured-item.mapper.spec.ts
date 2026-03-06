import { CapturedItem } from '../../../../../src/domain/entities/captured-item.entity';
import { Title } from '../../../../../src/domain/value-objects/title.value-object';
import {
  toDomain,
  toPersistence,
} from '../../../../../src/infrastructure/persistence/mappers/captured-item.mapper';

describe('CapturedItemMapper', () => {
  it('should map domain entity to ORM entity and back', () => {
    const domain = CapturedItem.create({
      id: 'cmd123',
      title: Title.create('Buy milk'),
      notes: '2% milk',
    });

    // Assume item was clarified so status changed
    domain.clarifyAsAction();

    const userId = 'usr123';
    const orm = toPersistence(domain, userId);

    expect(orm.id).toBe('cmd123');
    expect(orm.userId).toBe('usr123');
    expect(orm.title).toBe('Buy milk');
    expect(orm.notes).toBe('2% milk');
    expect(orm.status).toBe('CLARIFIED_AS_ACTION');

    const restored = toDomain(orm);

    expect(restored.id).toBe('cmd123');
    expect(restored.title.getValue()).toBe('Buy milk');
    // testing private fields using bracket notation in tests
    expect(restored['notes']).toBe('2% milk');
    expect(restored.getStatus()).toBe('CLARIFIED_AS_ACTION');
  });

  it('should handle missing notes correctly', () => {
    const domain = CapturedItem.create({
      id: 'cmd456',
      title: Title.create('Task only'),
    });

    const orm = toPersistence(domain, 'usr123');
    expect(orm.notes).toBeNull();

    const restored = toDomain(orm);
    expect(restored['notes']).toBeUndefined();
  });
});
