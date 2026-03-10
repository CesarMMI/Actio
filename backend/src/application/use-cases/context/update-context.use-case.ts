import { Context } from '../../../domain/entities/context.entity';
import { ContextNotFoundError } from '../../../domain/errors/context-not-found.error';
import { ContextTitleAlreadyExistsError } from '../../../domain/errors/context-title-already-exists.error';
import { IContextRepository } from '../../../domain/interfaces/IContextRepository';
import type { UpdateContextInput } from '../../interfaces/context/update-context.input';

export class UpdateContextUseCase {
  constructor(private readonly contexts: IContextRepository) {}

  async execute(input: UpdateContextInput): Promise<Context> {
    const context = await this.contexts.findById(input.id);
    if (!context) throw new ContextNotFoundError(input.id);

    const existing = await this.contexts.findByTitle(input.title);
    if (existing && existing.id !== input.id) throw new ContextTitleAlreadyExistsError(input.title);

    context.rename(input.title);
    return this.contexts.save(context);
  }
}
