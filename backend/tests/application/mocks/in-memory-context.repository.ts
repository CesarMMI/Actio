import { Context } from '../../../src/domain/entities/context.entity';
import { IContextRepository } from '../../../src/domain/interfaces/IContextRepository';

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

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
