import { v4 as uuidv4 } from 'uuid';
import { Context } from '../../../domain/entities/context';
import { IContextRepository } from '../../../domain/interfaces';
import { ICreateContextUseCase, CreateContextInput } from '../../interfaces/context/create-context.use-case.interface';

export class CreateContextUseCase implements ICreateContextUseCase {
  constructor(private readonly contexts: IContextRepository) {}

  async execute(input: CreateContextInput): Promise<Context> {
    const context = new Context({
      id: uuidv4(),
      name: input.name,
      description: input.description,
      active: true,
      createdAt: new Date(),
    });
    await this.contexts.save(context);
    return context;
  }
}
