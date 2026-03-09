export interface IDeactivateContextUseCase {
  execute(contextId: string): Promise<void>;
}
