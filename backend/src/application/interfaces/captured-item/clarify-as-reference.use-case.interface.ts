export interface IClarifyAsReferenceUseCase {
  execute(capturedItemId: string): Promise<void>;
}
