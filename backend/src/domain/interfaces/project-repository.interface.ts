import { Injectable } from "../../di-container/di-container-injectable";
import { Project } from "../entities/project/project.entity";
import { ProjectListQuery } from "./project-list-query";
import { IRepository } from "./repository.interface";
import type { PaginatedResult } from "./paginated-result";

export const PROJECT_REPOSITORY = new Injectable<IProjectRepository>(
  "IProjectRepository",
);

export interface IProjectRepository extends IRepository<Project> {
  findByTitle(title: string): Promise<Project | null>;
  findWithQuery(query: ProjectListQuery): Promise<PaginatedResult<Project>>;
}
