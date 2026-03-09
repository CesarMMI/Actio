export interface IArchiveActionUseCase {
  execute(actionId: string): Promise<void>;
}
