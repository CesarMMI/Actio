import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { IContextRepository } from '../../../domain/interfaces/repositories/context-repository.interface';
import {
  DeactivateContextInput,
  DeactivateContextOutput,
} from '../../dtos/contexts/deactivate-context.dto';
import { toContextDto } from '../../mappers/context.mapper';

export class DeactivateContextUseCase {
  constructor(private readonly contexts: IContextRepository) {}

  async execute(
    input: DeactivateContextInput,
  ): Promise<DeactivateContextOutput> {
    const ctx = await this.contexts.findByIdForUser(
      input.userId,
      input.contextId,
    );
    if (!ctx) throw new EntityNotFoundError('Context', input.contextId);

    ctx.deactivate();
    const saved = await this.contexts.saveForUser(input.userId, ctx);
    return { context: toContextDto(saved) };
  }
}
