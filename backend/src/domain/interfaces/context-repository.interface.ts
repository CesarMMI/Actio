import { Injectable } from "../../di-container/di-container-injectable";
import { Context } from "../entities/context/context.entity";
import { ContextListQuery } from "./context-list-query";
import { IRepository } from "./repository.interface";
import type { PaginatedResult } from "./paginated-result";

export const CONTEXT_REPOSITORY = new Injectable<IContextRepository>(
  "IContextRepository",
);

export interface IContextRepository extends IRepository<Context> {
  findByTitle(title: string): Promise<Context | null>;
  findWithQuery(query: ContextListQuery): Promise<PaginatedResult<Context>>;
}
