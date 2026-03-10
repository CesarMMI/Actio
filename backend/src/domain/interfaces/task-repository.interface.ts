import { Injectable } from "../../di-container/di-container-injectable";
import { Task } from "../entities/task/task.entity";
import { TaskListQuery } from "./task-list-query";
import { IRepository } from "./repository.interface";
import type { PaginatedResult } from "./paginated-result";

export const TASK_REPOSITORY = new Injectable<ITaskRepository>(
  "ITaskRepository",
);

export interface ITaskRepository extends IRepository<Task> {
  findByProjectId(projectId: string): Promise<Task[]>;
  findByContextId(contextId: string): Promise<Task[]>;
  findWithQuery(query: TaskListQuery): Promise<PaginatedResult<Task>>;
}
