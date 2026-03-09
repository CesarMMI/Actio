import { Context } from '../../../domain/entities/context';

export interface CreateContextInput {
  name: string;
  description?: string;
}

export interface ICreateContextUseCase {
  execute(input: CreateContextInput): Promise<Context>;
}
