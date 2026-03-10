import { ContextNotFoundError } from "../../../domain/errors/context/context-not-found.error";
import { IContextRepository } from "../../../domain/interfaces/context-repository.interface";
import { IGetContextUseCase } from "../../interfaces/context/get-context.use-case.interface";
import type { GetContextInput } from "../../types/inputs/context/get-context.input";
import type { GetContextOutput } from "../../types/outputs/context/get-context.output";

export class GetContextUseCase implements IGetContextUseCase {
  constructor(private readonly contexts: IContextRepository) {}

  async execute(input: GetContextInput): Promise<GetContextOutput> {
    const context = await this.contexts.findById(input.id);
    if (!context) throw new ContextNotFoundError(input.id);
    return context;
  }
}
