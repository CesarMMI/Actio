import { User } from '../../../domain/entities/user.entity';
import { UserOrmEntity } from '../orm-entities/user.orm-entity';

export function toDomain(orm: UserOrmEntity): User {
  return User.create({
    id: orm.id,
    email: orm.email,
    passwordHash: orm.passwordHash,
  });
}

export function toPersistence(domain: User): UserOrmEntity {
  const orm = new UserOrmEntity();
  orm.id = domain.id;
  orm.email = domain.email;
  orm.passwordHash = domain.passwordHash;
  return orm;
}
