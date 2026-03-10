import { IContextRepository } from "../../../domain/interfaces/context-repository.interface";
import { IListContextsUseCase } from "../../interfaces/context/list-contexts.use-case.interface";
import type { ListContextsOutput } from "../../types/outputs/context/list-contexts.output";

export class ListContextsUseCase implements IListContextsUseCase {
  constructor(private readonly contexts: IContextRepository) {}

  async execute(): Promise<ListContextsOutput> {
    return this.contexts.findAll();
  }
}
