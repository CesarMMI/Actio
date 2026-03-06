import { Context } from '../../entities/context.entity';

export interface IContextRepository {
  saveForUser(userId: string, context: Context): Promise<Context>;
  findByIdForUser(userId: string, id: string): Promise<Context | null>;
  findAllByUser(
    userId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<Context[]>;
}
