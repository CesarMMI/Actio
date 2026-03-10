import { Context } from '../../../domain/entities/context/context.entity';
import { ContextTitleAlreadyExistsError } from '../../../domain/errors/context/context-title-already-exists.error';
import { IContextRepository } from '../../../domain/interfaces/context-repository.interface';
import { ICreateContextUseCase } from '../../interfaces/context/create-context.use-case.interface';
import type { CreateContextInput } from '../../types/inputs/context/create-context.input';
import type { CreateContextOutput } from '../../types/outputs/context/create-context.output';

export class CreateContextUseCase implements ICreateContextUseCase {
  constructor(private readonly contexts: IContextRepository) {}

  async execute(input: CreateContextInput): Promise<CreateContextOutput> {
    const existing = await this.contexts.findByTitle(input.title);
    if (existing) throw new ContextTitleAlreadyExistsError(input.title);

    const context = Context.create(input);
    return this.contexts.save(context);
  }
}
