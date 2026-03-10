import { Context } from '../../../domain/entities/context.entity';
import { IContextRepository } from '../../../domain/interfaces/IContextRepository';

export class ListContextsUseCase {
  constructor(private readonly contexts: IContextRepository) {}

  async execute(): Promise<Context[]> {
    return this.contexts.findAll();
  }
}
