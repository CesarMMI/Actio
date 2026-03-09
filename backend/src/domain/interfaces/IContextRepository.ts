import { Context } from '../entities/context';

export interface IContextRepository {
  save(context: Context): Promise<void>;
  findById(id: string): Promise<Context | null>;
}
