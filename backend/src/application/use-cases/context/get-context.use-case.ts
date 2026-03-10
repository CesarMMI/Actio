import { Context } from '../../../domain/entities/context.entity';
import { ContextNotFoundError } from '../../../domain/errors/context-not-found.error';
import { IContextRepository } from '../../../domain/interfaces/IContextRepository';
import type { GetContextInput } from '../../interfaces/context/get-context.input';

export class GetContextUseCase {
  constructor(private readonly contexts: IContextRepository) {}

  async execute(input: GetContextInput): Promise<Context> {
    const context = await this.contexts.findById(input.id);
    if (!context) throw new ContextNotFoundError(input.id);
    return context;
  }
}
