import {
  ListActionsByContextInput,
  ListActionsByContextOutput,
} from '../../../dtos/actions/list-actions-by-context.dto';

export const IListActionsByContextUseCase = Symbol(
  'IListActionsByContextUseCase',
);

export interface IListActionsByContextUseCase {
  execute(input: ListActionsByContextInput): Promise<ListActionsByContextOutput>;
}
