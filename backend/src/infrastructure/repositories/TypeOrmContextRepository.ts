import { DataSource, Repository } from 'typeorm';
import { Context } from '../../domain/entities/context';
import { IContextRepository } from '../../domain/interfaces';
import { ContextOrmEntity } from '../entities/ContextOrmEntity';

export class TypeOrmContextRepository implements IContextRepository {
  private readonly repo: Repository<ContextOrmEntity>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(ContextOrmEntity);
  }

  async save(context: Context): Promise<void> {
    await this.repo.save(this.toOrm(context));
  }

  async findById(id: string): Promise<Context | null> {
    const entity = await this.repo.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  private toDomain(entity: ContextOrmEntity): Context {
    return new Context({
      id: entity.id,
      name: entity.name,
      description: entity.description ?? undefined,
      active: entity.active,
      createdAt: entity.createdAt,
    });
  }

  private toOrm(context: Context): ContextOrmEntity {
    const entity = new ContextOrmEntity();
    entity.id = context.id;
    entity.name = context.name;
    entity.description = context.description ?? null;
    entity.active = context.active;
    entity.createdAt = context.createdAt;
    return entity;
  }
}
