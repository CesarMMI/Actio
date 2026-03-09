import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { TimeBucket } from '../../../domain/value-objects/time-bucket.value-object';
import { EnergyLevel } from '../../../domain/value-objects/energy-level.value-object';
import { IActionRepository } from '../../../domain/interfaces/repositories/action-repository.interface';
import { IContextRepository } from '../../../domain/interfaces/repositories/context-repository.interface';
import {
  ListActionsByContextInput,
  ListActionsByContextOutput,
} from '../../dtos/actions/list-actions-by-context.dto';
import { toActionDto } from '../../mappers/action.mapper';
import { IListActionsByContextUseCase } from '../../interfaces/use-cases/actions/list-actions-by-context.usecase.interface';

@Injectable()
export class ListActionsByContextUseCase implements IListActionsByContextUseCase {
  constructor(
    @Inject(IContextRepository) private readonly contexts: IContextRepository,
    @Inject(IActionRepository) private readonly actions: IActionRepository,
  ) {}

  async execute(
    input: ListActionsByContextInput,
  ): Promise<ListActionsByContextOutput> {
    const ctx = await this.contexts.findByIdForUser(
      input.userId,
      input.contextId,
    );
    if (!ctx) throw new EntityNotFoundError('Context', input.contextId);

    const filters = {
      timeBucket: input.timeBucket
        ? TimeBucket.create(input.timeBucket)
        : undefined,
      energyLevel: input.energyLevel
        ? EnergyLevel.create(input.energyLevel)
        : undefined,
      dueFrom: input.dueFrom ? new Date(input.dueFrom) : undefined,
      dueTo: input.dueTo ? new Date(input.dueTo) : undefined,
    };

    const result = await this.actions.findOpenByContext(
      input.userId,
      input.contextId,
      filters,
    );

    const sorted = [...result].sort((a, b) => {
      const aDue = a['dueDate']
        ? a['dueDate'].getTime()
        : Number.POSITIVE_INFINITY;
      const bDue = b['dueDate']
        ? b['dueDate'].getTime()
        : Number.POSITIVE_INFINITY;
      return aDue - bDue;
    });

    return { actions: sorted.map(toActionDto) };
  }
}
