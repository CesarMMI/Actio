import { Project } from '../../entities/project.entity';

export const IProjectRepository = Symbol('IProjectRepository');

export interface IProjectRepository {
  saveForUser(userId: string, project: Project): Promise<Project>;
  findByIdForUser(userId: string, id: string): Promise<Project | null>;
  findAllByUser(
    userId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<Project[]>;
}
