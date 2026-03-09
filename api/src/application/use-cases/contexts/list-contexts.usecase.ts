import { Inject, Injectable } from '@nestjs/common';
import { IContextRepository } from '../../../domain/interfaces/repositories/context-repository.interface';
import {
  ListContextsInput,
  ListContextsOutput,
} from '../../dtos/contexts/list-contexts.dto';
import { toContextDto } from '../../mappers/context.mapper';
import { IListContextsUseCase } from '../../interfaces/use-cases/contexts/list-contexts.usecase.interface';

@Injectable()
export class ListContextsUseCase implements IListContextsUseCase {
  constructor(
    @Inject(IContextRepository) private readonly contexts: IContextRepository,
  ) {}

  async execute(input: ListContextsInput): Promise<ListContextsOutput> {
    const contexts = await this.contexts.findAllByUser(input.userId);
    return { contexts: contexts.map(toContextDto) };
  }
}
