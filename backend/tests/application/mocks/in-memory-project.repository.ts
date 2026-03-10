import { Project } from '../../../src/domain/entities/project.entity';
import { IProjectRepository } from '../../../src/domain/interfaces/IProjectRepository';

export class InMemoryProjectRepository implements IProjectRepository {
  private store = new Map<string, Project>();

  async save(project: Project): Promise<Project> {
    this.store.set(project.id, project);
    return project;
  }

  async findById(id: string): Promise<Project | null> {
    return this.store.get(id) ?? null;
  }

  async findAll(): Promise<Project[]> {
    return Array.from(this.store.values());
  }

  async findByTitle(title: string): Promise<Project | null> {
    const lower = title.toLowerCase();
    return Array.from(this.store.values()).find(p => p.title.toLowerCase() === lower) ?? null;
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
