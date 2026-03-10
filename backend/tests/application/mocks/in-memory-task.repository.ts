import { Task } from '../../../src/domain/entities/task/task.entity';
import { ITaskRepository } from '../../../src/domain/interfaces/task-repository.interface';

export class InMemoryTaskRepository implements ITaskRepository {
  private store = new Map<string, Task>();

  async save(task: Task): Promise<Task> {
    this.store.set(task.id, task);
    return task;
  }

  async findById(id: string): Promise<Task | null> {
    return this.store.get(id) ?? null;
  }

  async findAll(): Promise<Task[]> {
    return Array.from(this.store.values());
  }

  async findByProjectId(projectId: string): Promise<Task[]> {
    return Array.from(this.store.values()).filter(t => t.projectId === projectId);
  }

  async findByContextId(contextId: string): Promise<Task[]> {
    return Array.from(this.store.values()).filter(t => t.contextId === contextId);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
