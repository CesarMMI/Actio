import { IContextRepository } from '../../../domain/interfaces';
import { ContextNotFoundError } from '../../errors/context-not-found.error';
import { IActivateContextUseCase } from '../../interfaces/context/activate-context.use-case.interface';

export class ActivateContextUseCase implements IActivateContextUseCase {
  constructor(private readonly contexts: IContextRepository) {}

  async execute(contextId: string): Promise<void> {
    const context = await this.contexts.findById(contextId);
    if (!context) throw new ContextNotFoundError(contextId);

    context.activate();
    await this.contexts.save(context);
  }
}
