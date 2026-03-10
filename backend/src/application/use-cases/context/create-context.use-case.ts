import { Context } from '../../../domain/entities/context.entity';
import { ContextTitleAlreadyExistsError } from '../../../domain/errors/context-title-already-exists.error';
import { IContextRepository } from '../../../domain/interfaces/IContextRepository';
import type { CreateContextInput } from '../../interfaces/context/create-context.input';

export class CreateContextUseCase {
  constructor(private readonly contexts: IContextRepository) {}

  async execute(input: CreateContextInput): Promise<Context> {
    const existing = await this.contexts.findByTitle(input.title);
    if (existing) throw new ContextTitleAlreadyExistsError(input.title);

    const context = Context.create(input);
    return this.contexts.save(context);
  }
}
