import { Context } from '../../../../../src/domain/entities/context.entity';
import {
  toDomain,
  toPersistence,
} from '../../../../../src/infrastructure/persistence/mappers/context.mapper';

describe('ContextMapper', () => {
  it('should map domain entity to ORM entity and back', () => {
    const domain = Context.create({
      id: 'ctx123',
      name: 'Errands',
      description: 'Things to do out of house',
    });

    domain.deactivate();

    const userId = 'usr123';
    const orm = toPersistence(domain, userId);

    expect(orm.id).toBe('ctx123');
    expect(orm.userId).toBe('usr123');
    expect(orm.name).toBe('Errands');
    expect(orm.description).toBe('Things to do out of house');
    expect(orm.active).toBe(false);

    const restored = toDomain(orm);

    expect(restored.id).toBe('ctx123');
    expect(restored.getName()).toBe('Errands');
    expect(restored.description).toBe('Things to do out of house');
    expect(restored.isActive()).toBe(false);
  });

  it('should handle missing description', () => {
    const domain = Context.create({
      id: 'ctx456',
      name: 'Office',
    });

    const orm = toPersistence(domain, 'usr123');
    expect(orm.description).toBeNull();
    expect(orm.active).toBe(true);

    const restored = toDomain(orm);
    expect(restored.description).toBeUndefined();
    expect(restored.isActive()).toBe(true);
  });
});
