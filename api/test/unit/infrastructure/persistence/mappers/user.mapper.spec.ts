import { User } from '../../../../../src/domain/entities/user.entity';
import { UserOrmEntity } from '../../../../../src/infrastructure/persistence/orm-entities/user.orm-entity';
import {
  toDomain,
  toPersistence,
} from '../../../../../src/infrastructure/persistence/mappers/user.mapper';

describe('UserMapper', () => {
  it('should map domain entity to ORM entity and back', () => {
    // 1. Arrange domain entity
    const domain = User.create({
      id: 'usr123',
      email: 'test@example.com',
      passwordHash: 'hashedpassword123',
    });

    // 2. Map to persistence
    const orm: UserOrmEntity = toPersistence(domain);

    expect(orm.id).toBe('usr123');
    expect(orm.email).toBe('test@example.com');
    expect(orm.passwordHash).toBe('hashedpassword123');

    // 3. Map back to domain
    const restored = toDomain(orm);

    expect(restored.id).toBe('usr123');
    expect(restored.email).toBe('test@example.com');
    expect(restored.passwordHash).toBe('hashedpassword123');
  });
});
