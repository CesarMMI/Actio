import { IContextRepository } from '../../../domain/interfaces';
import { ContextNotFoundError } from '../../errors/context-not-found.error';
import { IRenameContextUseCase, RenameContextInput } from '../../interfaces/context/rename-context.use-case.interface';

export class RenameContextUseCase implements IRenameContextUseCase {
  constructor(private readonly contexts: IContextRepository) {}

  async execute(input: RenameContextInput): Promise<void> {
    const context = await this.contexts.findById(input.contextId);
    if (!context) throw new ContextNotFoundError(input.contextId);

    context.rename(input.name);
    await this.contexts.save(context);
  }
}
