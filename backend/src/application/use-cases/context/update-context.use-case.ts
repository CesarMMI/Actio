import { ContextNotFoundError } from "../../../domain/errors/context/context-not-found.error";
import { ContextTitleAlreadyExistsError } from "../../../domain/errors/context/context-title-already-exists.error";
import { IContextRepository } from "../../../domain/interfaces/context-repository.interface";
import { IUpdateContextUseCase } from "../../interfaces/context/update-context.use-case.interface";
import type { UpdateContextInput } from "../../types/inputs/context/update-context.input";
import type { UpdateContextOutput } from "../../types/outputs/context/update-context.output";

export class UpdateContextUseCase implements IUpdateContextUseCase {
  constructor(private readonly contexts: IContextRepository) {}

  async execute(input: UpdateContextInput): Promise<UpdateContextOutput> {
    const context = await this.contexts.findById(input.id);
    if (!context) throw new ContextNotFoundError(input.id);

    const existing = await this.contexts.findByTitle(input.title);
    if (existing && existing.id !== input.id)
      throw new ContextTitleAlreadyExistsError(input.title);

    context.rename(input.title);
    return this.contexts.save(context);
  }
}
