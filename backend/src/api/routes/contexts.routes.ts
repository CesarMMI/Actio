import { NextFunction, Request, Response, Router } from "express";
import { ICreateContextUseCase } from "../../application/interfaces/context/create-context.use-case.interface";
import { IDeleteContextUseCase } from "../../application/interfaces/context/delete-context.use-case.interface";
import { IGetContextUseCase } from "../../application/interfaces/context/get-context.use-case.interface";
import { IListContextsUseCase } from "../../application/interfaces/context/list-contexts.use-case.interface";
import { IUpdateContextUseCase } from "../../application/interfaces/context/update-context.use-case.interface";
import type { ContextListQuery } from "../../domain/interfaces/context-list-query";

export function contextsRouter(useCases: {
  createContext: ICreateContextUseCase;
  getContext: IGetContextUseCase;
  listContexts: IListContextsUseCase;
  updateContext: IUpdateContextUseCase;
  deleteContext: IDeleteContextUseCase;
}): Router {
  const router = Router();
  // UC-C01: Create Context
  router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(await useCases.createContext.execute(req.body));
    } catch (err) {
      next(err);
    }
  });
  // UC-C03: List Contexts
  router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, sortBy, order } = req.query;
      const query: ContextListQuery = {};
      if (page !== undefined) query.page = parseInt(String(page), 10);
      if (limit !== undefined) query.limit = parseInt(String(limit), 10);
      if (sortBy !== undefined) query.sortBy = String(sortBy) as ContextListQuery['sortBy'];
      if (order !== undefined) query.order = String(order) as 'asc' | 'desc';
      res.json(await useCases.listContexts.execute(query));
    } catch (err) {
      next(err);
    }
  });
  // UC-C02: Get Context
  router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await useCases.getContext.execute({ id: req.params.id }));
    } catch (err) {
      next(err);
    }
  });
  // UC-C04: Update Context
  router.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await useCases.updateContext.execute({ id: req.params.id, title: req.body.title }));
    } catch (err) {
      next(err);
    }
  });
  // UC-C05: Delete Context
  router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await useCases.deleteContext.execute({ id: req.params.id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });
  return router;
}
