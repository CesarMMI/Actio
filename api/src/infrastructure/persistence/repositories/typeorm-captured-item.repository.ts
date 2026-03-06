import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CapturedItem } from '../../../domain/entities/captured-item.entity';
import { ICapturedItemRepository } from '../../../domain/interfaces/repositories/captured-item-repository.interface';
import { toDomain, toPersistence } from '../mappers/captured-item.mapper';
import { CapturedItemOrmEntity } from '../orm-entities/captured-item.orm-entity';

export class TypeOrmCapturedItemRepository implements ICapturedItemRepository {
  constructor(
    @InjectRepository(CapturedItemOrmEntity)
    private readonly repo: Repository<CapturedItemOrmEntity>,
  ) {}

  async saveForUser(userId: string, item: CapturedItem): Promise<CapturedItem> {
    const orm = toPersistence(item, userId);
    const saved = await this.repo.save(orm);
    return toDomain(saved);
  }

  async findByIdForUser(
    userId: string,
    id: string,
  ): Promise<CapturedItem | null> {
    const orm = await this.repo.findOne({ where: { id, userId } });
    if (!orm) return null;
    return toDomain(orm);
  }

  async findInboxByUser(
    userId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<CapturedItem[]> {
    const orms = await this.repo.find({
      where: { userId, status: 'INBOX' },
      take: options?.limit,
      skip: options?.offset,
    });
    return orms.map(toDomain);
  }
}
