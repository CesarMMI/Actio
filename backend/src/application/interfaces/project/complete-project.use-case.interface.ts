export interface ICompleteProjectUseCase {
  execute(projectId: string): Promise<void>;
}
