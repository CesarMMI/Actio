import { DataSource, Repository } from "typeorm";
import { Project } from "../../domain/entities/project/project.entity";
import { PaginatedResult } from "../../domain/interfaces/paginated-result";
import { ProjectListQuery } from "../../domain/interfaces/project-list-query";
import { IProjectRepository } from "../../domain/interfaces/project-repository.interface";
import { ProjectOrmEntity } from "../entities/project.orm-entity";

export class TypeOrmProjectRepository implements IProjectRepository {
  private readonly repo: Repository<ProjectOrmEntity>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(ProjectOrmEntity);
  }

  async save(project: Project): Promise<Project> {
    await this.repo.save(this.toOrm(project));
    return project;
  }

  async findById(id: string): Promise<Project | null> {
    const entity = await this.repo.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Project[]> {
    const entities = await this.repo.find({ order: { createdAt: "ASC" } });
    return entities.map((e) => this.toDomain(e));
  }

  async findByTitle(title: string): Promise<Project | null> {
    const entity = await this.repo
      .createQueryBuilder("proj")
      .where("LOWER(proj.title) = LOWER(:title)", { title })
      .getOne();
    return entity ? this.toDomain(entity) : null;
  }

  async findWithQuery(query: ProjectListQuery): Promise<PaginatedResult<Project>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const sortBy = query.sortBy ?? 'createdAt';
    const order = (query.order?.toUpperCase() ?? 'ASC') as 'ASC' | 'DESC';

    const qb = this.repo.createQueryBuilder('proj');
    qb.orderBy(`proj.${sortBy}`, order);
    qb.skip((page - 1) * limit).take(limit);

    const [entities, total] = await qb.getManyAndCount();
    return { items: entities.map((e) => this.toDomain(e)), total, page, limit };
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  private toDomain(entity: ProjectOrmEntity): Project {
    return Project.load({
      id: entity.id,
      title: entity.title,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private toOrm(project: Project): ProjectOrmEntity {
    const entity = new ProjectOrmEntity();
    entity.id = project.id;
    entity.title = project.title;
    entity.createdAt = project.createdAt;
    entity.updatedAt = project.updatedAt;
    return entity;
  }
}
