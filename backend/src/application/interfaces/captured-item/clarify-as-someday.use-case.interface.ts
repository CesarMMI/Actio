export interface IClarifyAsSomedayUseCase {
  execute(capturedItemId: string): Promise<void>;
}
