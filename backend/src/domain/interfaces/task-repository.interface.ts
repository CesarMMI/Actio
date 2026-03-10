import { Injectable } from "../../di-container/di-container-injectable";
import { Task } from "../entities/task/task.entity";
import { IRepository } from "./repository.interface";

export const TASK_REPOSITORY = new Injectable<ITaskRepository>(
  "ITaskRepository",
);

export interface ITaskRepository extends IRepository<Task> {
  findByProjectId(projectId: string): Promise<Task[]>;
  findByContextId(contextId: string): Promise<Task[]>;
}
