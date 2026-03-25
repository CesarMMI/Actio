import { Task } from '../../../src/domain/entities/task/task.entity';
import { PaginatedResult } from '../../../src/domain/queries/paginated-result';
import { TaskListQuery } from '../../../src/domain/queries/task/task-list-query';
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

  async findWithQuery(query: TaskListQuery): Promise<PaginatedResult<Task>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const sortBy = query.sortBy ?? 'createdAt';
    const order = query.order ?? 'asc';

    let items = Array.from(this.store.values());

    if (query.done !== undefined) {
      items = items.filter(t => t.done === query.done);
    }
    if (query.contextId !== undefined) {
      items = items.filter(t => t.contextId === query.contextId);
    }
    if (query.projectId !== undefined) {
      items = items.filter(t => t.projectId === query.projectId);
    }
    items.sort((a, b) => {
      const aVal = a[sortBy as keyof Task];
      const bVal = b[sortBy as keyof Task];
      const aStr = aVal instanceof Date ? aVal.toISOString() : String(aVal ?? '');
      const bStr = bVal instanceof Date ? bVal.toISOString() : String(bVal ?? '');
      return order === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });

    const total = items.length;
    const offset = (page - 1) * limit;
    return { items: items.slice(offset, offset + limit), total, page, limit };
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
