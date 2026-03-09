import { IContextRepository } from '../../../domain/interfaces';
import { ContextNotFoundError } from '../../errors/context-not-found.error';
import { IDeactivateContextUseCase } from '../../interfaces/context/deactivate-context.use-case.interface';

export class DeactivateContextUseCase implements IDeactivateContextUseCase {
  constructor(private readonly contexts: IContextRepository) {}

  async execute(contextId: string): Promise<void> {
    const context = await this.contexts.findById(contextId);
    if (!context) throw new ContextNotFoundError(contextId);

    context.deactivate();
    await this.contexts.save(context);
  }
}
