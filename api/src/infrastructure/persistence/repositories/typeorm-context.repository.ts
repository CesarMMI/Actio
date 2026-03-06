import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Context } from '../../../domain/entities/context.entity';
import { IContextRepository } from '../../../domain/interfaces/repositories/context-repository.interface';
import { toDomain, toPersistence } from '../mappers/context.mapper';
import { ContextOrmEntity } from '../orm-entities/context.orm-entity';

export class TypeOrmContextRepository implements IContextRepository {
  constructor(
    @InjectRepository(ContextOrmEntity)
    private readonly repo: Repository<ContextOrmEntity>,
  ) {}

  async saveForUser(userId: string, context: Context): Promise<Context> {
    const orm = toPersistence(context, userId);
    const saved = await this.repo.save(orm);
    return toDomain(saved);
  }

  async findByIdForUser(userId: string, id: string): Promise<Context | null> {
    const orm = await this.repo.findOne({ where: { id, userId } });
    if (!orm) return null;
    return toDomain(orm);
  }

  async findAllByUser(
    userId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<Context[]> {
    const orms = await this.repo.find({
      where: { userId },
      take: options?.limit,
      skip: options?.offset,
    });
    return orms.map(toDomain);
  }
}
