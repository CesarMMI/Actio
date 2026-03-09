import { DataSource, Repository } from 'typeorm';
import { CapturedItem } from '../../domain/entities/captured-item';
import { CapturedItemStatus } from '../../domain/enums';
import { ICapturedItemRepository } from '../../domain/interfaces';
import { CapturedItemOrmEntity } from '../entities/CapturedItemOrmEntity';

export class TypeOrmCapturedItemRepository implements ICapturedItemRepository {
  private readonly repo: Repository<CapturedItemOrmEntity>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(CapturedItemOrmEntity);
  }

  async save(item: CapturedItem): Promise<void> {
    await this.repo.save(this.toOrm(item));
  }

  async findById(id: string): Promise<CapturedItem | null> {
    const entity = await this.repo.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async findByStatus(status: CapturedItemStatus): Promise<CapturedItem[]> {
    const entities = await this.repo.findBy({ status });
    return entities.map(e => this.toDomain(e));
  }

  private toDomain(entity: CapturedItemOrmEntity): CapturedItem {
    return new CapturedItem({
      id: entity.id,
      title: entity.title,
      notes: entity.notes ?? undefined,
      status: entity.status as CapturedItemStatus,
      createdAt: entity.createdAt,
    });
  }

  private toOrm(item: CapturedItem): CapturedItemOrmEntity {
    const entity = new CapturedItemOrmEntity();
    entity.id = item.id;
    entity.title = item.title;
    entity.notes = item.notes ?? null;
    entity.status = item.status;
    entity.createdAt = item.createdAt;
    return entity;
  }
}
