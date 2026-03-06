import { Action } from '../../../../../src/domain/entities/action.entity';
import { Project } from '../../../../../src/domain/entities/project.entity';
import { Title } from '../../../../../src/domain/value-objects/title.value-object';
import {
  toDomain,
  toPersistence,
} from '../../../../../src/infrastructure/persistence/mappers/project.mapper';

describe('ProjectMapper', () => {
  it('should map domain entity to ORM entity and back', () => {
    const domain = Project.create({
      id: 'prj123',
      name: 'Home Renovation',
      description: 'Fix up the house',
    });

    const action = Action.create({
      id: 'a1',
      title: Title.create('Buy paint'),
    });
    action.complete();
    domain.complete([action]);

    const userId = 'usr123';
    const orm = toPersistence(domain, userId);

    expect(orm.id).toBe('prj123');
    expect(orm.userId).toBe('usr123');
    expect(orm.name).toBe('Home Renovation');
    expect(orm.description).toBe('Fix up the house');
    expect(orm.status).toBe('COMPLETED');

    const restored = toDomain(orm);

    expect(restored.id).toBe('prj123');
    expect(restored.getName()).toBe('Home Renovation');
    expect(restored.description).toBe('Fix up the house');
    expect(restored.getStatus()).toBe('COMPLETED');
  });

  it('should handle optional description properly', () => {
    const domain = Project.create({
      id: 'prj456',
      name: 'Simple Project',
    });

    const orm = toPersistence(domain, 'usr123');
    expect(orm.description).toBeNull();

    const restored = toDomain(orm);
    expect(restored.description).toBeUndefined();
  });
});
