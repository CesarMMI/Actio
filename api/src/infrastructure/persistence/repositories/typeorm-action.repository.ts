import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionQueryFiltersDto } from '../../../domain/dtos/action-query-filters.dto';
import { Action } from '../../../domain/entities/action.entity';
import { IActionRepository } from '../../../domain/interfaces/repositories/action-repository.interface';
import { toDomain, toPersistence } from '../mappers/action.mapper';
import { ActionOrmEntity } from '../orm-entities/action.orm-entity';

export class TypeOrmActionRepository implements IActionRepository {
  constructor(
    @InjectRepository(ActionOrmEntity)
    private readonly repo: Repository<ActionOrmEntity>,
  ) {}

  async saveForUser(userId: string, action: Action): Promise<Action> {
    const orm = toPersistence(action, userId);
    const saved = await this.repo.save(orm);
    return toDomain(saved);
  }

  async saveManyForUser(userId: string, actions: Action[]): Promise<Action[]> {
    const orms = actions.map((a) => toPersistence(a, userId));
    const saved = await this.repo.save(orms);
    return saved.map(toDomain);
  }

  async findByIdForUser(userId: string, id: string): Promise<Action | null> {
    const orm = await this.repo.findOne({ where: { id, userId } });
    if (!orm) return null;
    return toDomain(orm);
  }

  async findOpenByContext(
    userId: string,
    contextId: string,
    filters?: ActionQueryFiltersDto,
  ): Promise<Action[]> {
    const qb = this.repo.createQueryBuilder('action');

    qb.where('action.userId = :userId', { userId });
    qb.andWhere('action.contextId = :contextId', { contextId });
    qb.andWhere('action.status = :status', { status: 'OPEN' });

    if (filters?.timeBucket) {
      qb.andWhere('action.timeBucket = :timeBucket', {
        timeBucket: filters.timeBucket.getValue(),
      });
    }

    if (filters?.energyLevel) {
      qb.andWhere('action.energyLevel = :energyLevel', {
        energyLevel: filters.energyLevel.getValue(),
      });
    }

    // Due date range filtering could be added here later if needed

    qb.orderBy('action.dueDate', 'ASC', 'NULLS LAST');

    const orms = await qb.getMany();
    return orms.map(toDomain);
  }

  async findByProject(userId: string, projectId: string): Promise<Action[]> {
    const orms = await this.repo.find({ where: { userId, projectId } });
    return orms.map(toDomain);
  }
}
