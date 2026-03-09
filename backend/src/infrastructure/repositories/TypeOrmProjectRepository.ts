import { DataSource, Repository } from 'typeorm';
import { Project } from '../../domain/entities/project';
import { ProjectStatus } from '../../domain/enums';
import { IProjectRepository } from '../../domain/interfaces';
import { ProjectOrmEntity } from '../entities/ProjectOrmEntity';

export class TypeOrmProjectRepository implements IProjectRepository {
  private readonly repo: Repository<ProjectOrmEntity>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(ProjectOrmEntity);
  }

  async save(project: Project): Promise<void> {
    await this.repo.save(this.toOrm(project));
  }

  async findById(id: string): Promise<Project | null> {
    const entity = await this.repo.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  private toDomain(entity: ProjectOrmEntity): Project {
    return new Project({
      id: entity.id,
      name: entity.name,
      description: entity.description ?? undefined,
      status: entity.status as ProjectStatus,
      createdAt: entity.createdAt,
    });
  }

  private toOrm(project: Project): ProjectOrmEntity {
    const entity = new ProjectOrmEntity();
    entity.id = project.id;
    entity.name = project.name;
    entity.description = project.description ?? null;
    entity.status = project.status;
    entity.createdAt = project.createdAt;
    return entity;
  }
}
