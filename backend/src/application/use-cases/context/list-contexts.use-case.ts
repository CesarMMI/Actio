import { IContextRepository } from '../../../domain/interfaces/context-repository.interface';
import { IListContextsUseCase } from '../../interfaces/context/list-contexts.use-case.interface';
import type { ListContextsInput } from '../../types/inputs/context/list-contexts.input';
import type { ListContextsOutput } from '../../types/outputs/context/list-contexts.output';

export class ListContextsUseCase implements IListContextsUseCase {
  constructor(private readonly contexts: IContextRepository) {}

  async execute(input: ListContextsInput): Promise<ListContextsOutput> {
    return this.contexts.findWithQuery(input);
  }
}
