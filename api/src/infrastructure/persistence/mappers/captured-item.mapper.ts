import { CapturedItem } from '../../../domain/entities/captured-item.entity';
import { CapturedItemOrmEntity } from '../orm-entities/captured-item.orm-entity';
import { Title } from '../../../domain/value-objects/title.value-object';
import { CapturedItemStatus } from '../../../domain/enums/captured-item-status';

export function toDomain(orm: CapturedItemOrmEntity): CapturedItem {
  const item = CapturedItem.create({
    id: orm.id,
    title: Title.create(orm.title),
    notes: orm.notes || undefined,
  });

  // Override status
  item['status'] = orm.status as CapturedItemStatus;

  return item;
}

export function toPersistence(
  domain: CapturedItem,
  userId: string,
): CapturedItemOrmEntity {
  const orm = new CapturedItemOrmEntity();
  orm.id = domain.id;
  orm.userId = userId;
  orm.title = domain.title.getValue();
  orm.notes = domain['notes'] || null;
  orm.status = domain.getStatus();
  return orm;
}
