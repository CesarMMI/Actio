export interface IActivateContextUseCase {
  execute(contextId: string): Promise<void>;
}
