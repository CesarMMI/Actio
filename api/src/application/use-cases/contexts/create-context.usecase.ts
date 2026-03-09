import { Inject, Injectable } from '@nestjs/common';
import { Context } from '../../../domain/entities/context.entity';
import { IContextRepository } from '../../../domain/interfaces/repositories/context-repository.interface';
import { IIdGenerator } from '../../interfaces/services/id-generator.interface';
import {
  CreateContextInput,
  CreateContextOutput,
} from '../../dtos/contexts/create-context.dto';
import { toContextDto } from '../../mappers/context.mapper';
import { ICreateContextUseCase } from '../../interfaces/use-cases/contexts/create-context.usecase.interface';

@Injectable()
export class CreateContextUseCase implements ICreateContextUseCase {
  constructor(
    @Inject(IContextRepository) private readonly contexts: IContextRepository,
    @Inject(IIdGenerator) private readonly ids: IIdGenerator,
  ) {}

  async execute(input: CreateContextInput): Promise<CreateContextOutput> {
    const ctx = Context.create({
      id: this.ids.newId(),
      name: input.name,
      description: input.description,
    });

    const saved = await this.contexts.saveForUser(input.userId, ctx);
    return { context: toContextDto(saved) };
  }
}
