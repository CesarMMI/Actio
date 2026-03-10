import { Context } from '../entities/context.entity';

export interface IContextRepository {
  save(context: Context): Promise<Context>;
  findById(id: string): Promise<Context | null>;
  findAll(): Promise<Context[]>;
  findByTitle(title: string): Promise<Context | null>;
  delete(id: string): Promise<void>;
}
