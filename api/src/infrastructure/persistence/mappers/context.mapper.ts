import { Context } from '../../../domain/entities/context.entity';
import { ContextOrmEntity } from '../orm-entities/context.orm-entity';

export function toDomain(orm: ContextOrmEntity): Context {
  const context = Context.create({
    id: orm.id,
    name: orm.name,
    description: orm.description || undefined,
  });

  context['active'] = orm.active;

  return context;
}

export function toPersistence(
  domain: Context,
  userId: string,
): ContextOrmEntity {
  const orm = new ContextOrmEntity();
  orm.id = domain.id;
  orm.userId = userId;
  orm.name = domain.getName();
  orm.description = domain.description || null;
  orm.active = domain.isActive();
  return orm;
}
