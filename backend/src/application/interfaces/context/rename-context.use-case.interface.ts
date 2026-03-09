export interface RenameContextInput {
  contextId: string;
  name: string;
}

export interface IRenameContextUseCase {
  execute(input: RenameContextInput): Promise<void>;
}
