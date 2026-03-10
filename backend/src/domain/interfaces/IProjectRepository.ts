import { Project } from '../entities/project.entity';

export interface IProjectRepository {
  save(project: Project): Promise<Project>;
  findById(id: string): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  findByTitle(title: string): Promise<Project | null>;
  delete(id: string): Promise<void>;
}
