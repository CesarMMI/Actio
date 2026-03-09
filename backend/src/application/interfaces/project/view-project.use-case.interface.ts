import { Project } from '../../../domain/entities/project';
import { Action } from '../../../domain/entities/action';

export interface ViewProjectOutput {
  project: Project;
  actions: Action[];
}

export interface IViewProjectUseCase {
  execute(projectId: string): Promise<ViewProjectOutput>;
}
