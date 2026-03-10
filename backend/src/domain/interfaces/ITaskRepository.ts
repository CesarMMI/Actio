import { Task } from '../entities/task.entity';

export interface ITaskRepository {
  save(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAll(): Promise<Task[]>;
  findByProjectId(projectId: string): Promise<Task[]>;
  findByContextId(contextId: string): Promise<Task[]>;
  delete(id: string): Promise<void>;
}
