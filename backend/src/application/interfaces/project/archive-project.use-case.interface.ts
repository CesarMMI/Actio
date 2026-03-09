export interface IArchiveProjectUseCase {
  execute(projectId: string): Promise<void>;
}
