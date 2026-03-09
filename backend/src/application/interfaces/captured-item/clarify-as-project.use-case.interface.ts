import { Project } from '../../../domain/entities/project';

export interface ClarifyAsProjectInput {
  capturedItemId: string;
  projectName: string;
  projectDescription?: string;
}

export interface IClarifyAsProjectUseCase {
  execute(input: ClarifyAsProjectInput): Promise<Project>;
}
