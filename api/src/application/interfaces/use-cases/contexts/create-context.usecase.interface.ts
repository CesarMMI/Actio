import {
  CreateContextInput,
  CreateContextOutput,
} from '../../../dtos/contexts/create-context.dto';

export const ICreateContextUseCase = Symbol('ICreateContextUseCase');

export interface ICreateContextUseCase {
  execute(input: CreateContextInput): Promise<CreateContextOutput>;
}
