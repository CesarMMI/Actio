import { DataSource, Repository } from "typeorm";
import { Context } from "../../domain/entities/context/context.entity";
import { ContextListQuery } from "../../domain/queries/context/context-list-query";
import { PaginatedResult } from "../../domain/queries/paginated-result";
import { IContextRepository } from "../../domain/interfaces/context-repository.interface";
import { ContextOrmEntity } from "../entities/context.orm-entity";

export class TypeOrmContextRepository implements IContextRepository {
  private readonly repo: Repository<ContextOrmEntity>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(ContextOrmEntity);
  }

  async save(context: Context): Promise<Context> {
    await this.repo.save(this.toOrm(context));
    return context;
  }

  async findById(id: string): Promise<Context | null> {
    const entity = await this.repo.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Context[]> {
    const entities = await this.repo.find({ order: { createdAt: "ASC" } });
    return entities.map((e) => this.toDomain(e));
  }

  async findByTitle(title: string): Promise<Context | null> {
    const entity = await this.repo
      .createQueryBuilder("ctx")
      .where("LOWER(ctx.title) = LOWER(:title)", { title })
      .getOne();
    return entity ? this.toDomain(entity) : null;
  }

  async findWithQuery(query: ContextListQuery): Promise<PaginatedResult<Context>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const sortBy = query.sortBy ?? 'createdAt';
    const order = (query.order?.toUpperCase() ?? 'ASC') as 'ASC' | 'DESC';

    const qb = this.repo.createQueryBuilder('ctx');
    qb.orderBy(`ctx.${sortBy}`, order);
    qb.skip((page - 1) * limit).take(limit);

    const [entities, total] = await qb.getManyAndCount();
    return { items: entities.map((e) => this.toDomain(e)), total, page, limit };
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  private toDomain(entity: ContextOrmEntity): Context {
    return Context.load({
      id: entity.id,
      title: entity.title,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private toOrm(context: Context): ContextOrmEntity {
    const entity = new ContextOrmEntity();
    entity.id = context.id;
    entity.title = context.title;
    entity.createdAt = context.createdAt;
    entity.updatedAt = context.updatedAt;
    return entity;
  }
}
