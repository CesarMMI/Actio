import { DataSource, Repository } from "typeorm";
import { Task } from "../../domain/entities/task/task.entity";
import { PaginatedResult } from "../../domain/queries/paginated-result";
import { TaskListQuery } from "../../domain/queries/task/task-list-query";
import { ITaskRepository } from "../../domain/interfaces/task-repository.interface";
import { TaskOrmEntity } from "../entities/task.orm-entity";

export class TypeOrmTaskRepository implements ITaskRepository {
  private readonly repo: Repository<TaskOrmEntity>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(TaskOrmEntity);
  }

  async save(task: Task): Promise<Task> {
    await this.repo.save(this.toOrm(task));
    return task;
  }

  async findById(id: string): Promise<Task | null> {
    const entity = await this.repo.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Task[]> {
    const entities = await this.repo.find({ order: { createdAt: "ASC" } });
    return entities.map((e) => this.toDomain(e));
  }

  async findByProjectId(projectId: string): Promise<Task[]> {
    const entities = await this.repo.find({
      where: { projectId },
      order: { createdAt: "ASC" },
    });
    return entities.map((e) => this.toDomain(e));
  }

  async findByContextId(contextId: string): Promise<Task[]> {
    const entities = await this.repo.find({
      where: { contextId },
      order: { createdAt: "ASC" },
    });
    return entities.map((e) => this.toDomain(e));
  }

  async findWithQuery(query: TaskListQuery): Promise<PaginatedResult<Task>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const sortBy = query.sortBy ?? 'createdAt';
    const order = (query.order?.toUpperCase() ?? 'ASC') as 'ASC' | 'DESC';

    const qb = this.repo.createQueryBuilder('task');

    if (query.done !== undefined) {
      qb.andWhere('task.done = :done', { done: query.done });
    }
    if (query.contextId !== undefined) {
      qb.andWhere('task.contextId = :contextId', { contextId: query.contextId });
    }
    if (query.projectId !== undefined) {
      qb.andWhere('task.projectId = :projectId', { projectId: query.projectId });
    }
    qb.orderBy(`task.${sortBy}`, order);
    qb.skip((page - 1) * limit).take(limit);

    const [entities, total] = await qb.getManyAndCount();
    return { items: entities.map((e) => this.toDomain(e)), total, page, limit };
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  private toDomain(entity: TaskOrmEntity): Task {
    return Task.load({
      id: entity.id,
      description: entity.description,
      done: entity.done,
      doneAt: entity.doneAt ?? undefined,
      contextId: entity.contextId ?? undefined,
      projectId: entity.projectId ?? undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private toOrm(task: Task): TaskOrmEntity {
    const entity = new TaskOrmEntity();
    entity.id = task.id;
    entity.description = task.description;
    entity.done = task.done;
    entity.doneAt = task.doneAt ?? null;
    entity.contextId = task.contextId ?? null;
    entity.projectId = task.projectId ?? null;
    entity.createdAt = task.createdAt;
    entity.updatedAt = task.updatedAt;
    return entity;
  }
}
