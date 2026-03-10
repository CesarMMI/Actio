import { DataSource, Repository } from 'typeorm';
import { Task } from '../../domain/entities/task.entity';
import { ITaskRepository } from '../../domain/interfaces/ITaskRepository';
import { TaskOrmEntity } from '../entities/TaskOrmEntity';

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
    const entities = await this.repo.find({ order: { createdAt: 'ASC' } });
    return entities.map(e => this.toDomain(e));
  }

  async findByProjectId(projectId: string): Promise<Task[]> {
    const entities = await this.repo.find({
      where: { projectId },
      order: { createdAt: 'ASC' },
    });
    return entities.map(e => this.toDomain(e));
  }

  async findByContextId(contextId: string): Promise<Task[]> {
    const entities = await this.repo.find({
      where: { contextId },
      order: { createdAt: 'ASC' },
    });
    return entities.map(e => this.toDomain(e));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  private toDomain(entity: TaskOrmEntity): Task {
    return Task.reconstitute({
      id: entity.id,
      description: entity.description,
      contextId: entity.contextId ?? undefined,
      projectId: entity.projectId ?? undefined,
      parentTaskId: entity.parentTaskId ?? undefined,
      childTaskId: entity.childTaskId ?? undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private toOrm(task: Task): TaskOrmEntity {
    const entity = new TaskOrmEntity();
    entity.id = task.id;
    entity.description = task.description;
    entity.contextId = task.contextId ?? null;
    entity.projectId = task.projectId ?? null;
    entity.parentTaskId = task.parentTaskId ?? null;
    entity.childTaskId = task.childTaskId ?? null;
    entity.createdAt = task.createdAt;
    entity.updatedAt = task.updatedAt;
    return entity;
  }
}
