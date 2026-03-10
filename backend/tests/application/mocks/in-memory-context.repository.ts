import { Context } from '../../../src/domain/entities/context/context.entity';
import { ContextListQuery } from '../../../src/domain/interfaces/context-list-query';
import { PaginatedResult } from '../../../src/domain/interfaces/paginated-result';
import { IContextRepository } from '../../../src/domain/interfaces/context-repository.interface';

export class InMemoryContextRepository implements IContextRepository {
  private store = new Map<string, Context>();

  async save(context: Context): Promise<Context> {
    this.store.set(context.id, context);
    return context;
  }

  async findById(id: string): Promise<Context | null> {
    return this.store.get(id) ?? null;
  }

  async findAll(): Promise<Context[]> {
    return Array.from(this.store.values());
  }

  async findByTitle(title: string): Promise<Context | null> {
    const lower = title.toLowerCase();
    return Array.from(this.store.values()).find(c => c.title.toLowerCase() === lower) ?? null;
  }

  async findWithQuery(query: ContextListQuery): Promise<PaginatedResult<Context>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const sortBy = query.sortBy ?? 'createdAt';
    const order = query.order ?? 'asc';

    let items = Array.from(this.store.values());

    items.sort((a, b) => {
      const aVal = a[sortBy as keyof Context];
      const bVal = b[sortBy as keyof Context];
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
