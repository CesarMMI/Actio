import { Injectable } from "../../di-container/di-container-injectable";
import { Project } from "../entities/project/project.entity";
import { IRepository } from "./repository.interface";

export const PROJECT_REPOSITORY = new Injectable<IProjectRepository>(
  "IProjectRepository",
);

export interface IProjectRepository extends IRepository<Project> {
  findByTitle(title: string): Promise<Project | null>;
}
