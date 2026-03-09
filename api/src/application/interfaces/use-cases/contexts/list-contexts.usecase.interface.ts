import {
  ListContextsInput,
  ListContextsOutput,
} from '../../../dtos/contexts/list-contexts.dto';

export const IListContextsUseCase = Symbol('IListContextsUseCase');

export interface IListContextsUseCase {
  execute(input: ListContextsInput): Promise<ListContextsOutput>;
}
