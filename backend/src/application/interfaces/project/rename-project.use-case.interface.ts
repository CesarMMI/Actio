export interface RenameProjectInput {
  projectId: string;
  name: string;
}

export interface IRenameProjectUseCase {
  execute(input: RenameProjectInput): Promise<void>;
}
