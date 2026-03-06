import { IContextRepository } from '../../../domain/interfaces/repositories/context-repository.interface';
import {
  ListContextsInput,
  ListContextsOutput,
} from '../../dtos/contexts/list-contexts.dto';
import { toContextDto } from '../../mappers/context.mapper';

export class ListContextsUseCase {
  constructor(private readonly contexts: IContextRepository) {}

  async execute(input: ListContextsInput): Promise<ListContextsOutput> {
    const contexts = await this.contexts.findAllByUser(input.userId);
    return { contexts: contexts.map(toContextDto) };
  }
}
