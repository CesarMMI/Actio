import { Project } from '../../../src/domain/entities/project/project.entity';
import { PaginatedResult } from '../../../src/domain/interfaces/paginated-result';
import { ProjectListQuery } from '../../../src/domain/interfaces/project-list-query';
import { IProjectRepository } from '../../../src/domain/interfaces/project-repository.interface';

export class InMemoryProjectRepository implements IProjectRepository {
  private store = new Map<string, Project>();

  async save(project: Project): Promise<Project> {
    this.store.set(project.id, project);
    return project;
  }

  async findById(id: string): Promise<Project | null> {
    return this.store.get(id) ?? null;
  }

  async findAll(): Promise<Project[]> {
    return Array.from(this.store.values());
  }

  async findByTitle(title: string): Promise<Project | null> {
    const lower = title.toLowerCase();
    return Array.from(this.store.values()).find(p => p.title.toLowerCase() === lower) ?? null;
  }

  async findWithQuery(query: ProjectListQuery): Promise<PaginatedResult<Project>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const sortBy = query.sortBy ?? 'createdAt';
    const order = query.order ?? 'asc';

    let items = Array.from(this.store.values());

    items.sort((a, b) => {
      const aVal = a[sortBy as keyof Project];
      const bVal = b[sortBy as keyof Project];
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
