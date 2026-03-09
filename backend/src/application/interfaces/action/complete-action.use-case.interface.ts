export interface ICompleteActionUseCase {
  execute(actionId: string): Promise<void>;
}
