import { Injectable } from "../../di-container/di-container-injectable";
import { Context } from "../entities/context/context.entity";
import { IRepository } from "./repository.interface";

export const CONTEXT_REPOSITORY = new Injectable<IContextRepository>(
  "IContextRepository",
);

export interface IContextRepository extends IRepository<Context> {
  findByTitle(title: string): Promise<Context | null>;
}
