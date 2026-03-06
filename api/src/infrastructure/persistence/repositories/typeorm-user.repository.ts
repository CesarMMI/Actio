import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/interfaces/repositories/user-repository.interface';
import { toDomain, toPersistence } from '../mappers/user.mapper';
import { UserOrmEntity } from '../orm-entities/user.orm-entity';

export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async save(user: User): Promise<User> {
    const orm = toPersistence(user);
    const saved = await this.repo.save(orm);
    return toDomain(saved);
  }

  async findById(id: string): Promise<User | null> {
    const orm = await this.repo.findOne({ where: { id } });
    if (!orm) return null;
    return toDomain(orm);
  }

  async findByEmail(email: string): Promise<User | null> {
    const orm = await this.repo.findOne({ where: { email } });
    if (!orm) return null;
    return toDomain(orm);
  }
}
