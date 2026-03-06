import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../../domain/entities/project.entity';
import { IProjectRepository } from '../../../domain/interfaces/repositories/project-repository.interface';
import { toDomain, toPersistence } from '../mappers/project.mapper';
import { ProjectOrmEntity } from '../orm-entities/project.orm-entity';

export class TypeOrmProjectRepository implements IProjectRepository {
  constructor(
    @InjectRepository(ProjectOrmEntity)
    private readonly repo: Repository<ProjectOrmEntity>,
  ) {}

  async saveForUser(userId: string, project: Project): Promise<Project> {
    const orm = toPersistence(project, userId);
    const saved = await this.repo.save(orm);
    return toDomain(saved);
  }

  async findByIdForUser(userId: string, id: string): Promise<Project | null> {
    const orm = await this.repo.findOne({ where: { id, userId } });
    if (!orm) return null;
    return toDomain(orm);
  }

  async findAllByUser(
    userId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<Project[]> {
    const orms = await this.repo.find({
      where: { userId },
      take: options?.limit,
      skip: options?.offset,
    });
    return orms.map(toDomain);
  }
}
