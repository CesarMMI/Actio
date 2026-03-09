export interface IMoveToTrashUseCase {
  execute(capturedItemId: string): Promise<void>;
}
