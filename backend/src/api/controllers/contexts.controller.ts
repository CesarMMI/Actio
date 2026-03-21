import { Router, Request, Response, NextFunction } from 'express';
import { ICreateContextUseCase } from '../../application/interfaces/context/create-context.use-case.interface';
import { IDeleteContextUseCase } from '../../application/interfaces/context/delete-context.use-case.interface';
import { IGetContextUseCase } from '../../application/interfaces/context/get-context.use-case.interface';
import { IListContextsUseCase } from '../../application/interfaces/context/list-contexts.use-case.interface';
import { IUpdateContextUseCase } from '../../application/interfaces/context/update-context.use-case.interface';
import type { ContextListQuery } from '../../domain/interfaces/context-list-query';
import { IController } from '../interfaces/controller.interface';

export class ContextsController implements IController {
  readonly basePath = '/contexts';

  constructor(
    private readonly createContext: ICreateContextUseCase,
    private readonly getContext: IGetContextUseCase,
    private readonly listContexts: IListContextsUseCase,
    private readonly updateContext: IUpdateContextUseCase,
    private readonly deleteContext: IDeleteContextUseCase,
  ) {}

  registerRoutes(router: Router): void {
    router.post('/', this.create.bind(this));
    router.get('/', this.list.bind(this));
    router.get('/:id', this.get.bind(this));
    router.patch('/:id', this.update.bind(this));
    router.delete('/:id', this.delete.bind(this));
  }

  // UC-C01: Create Context
  private async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(201).json(await this.createContext.execute(req.body));
    } catch (err) {
      next(err);
    }
  }

  // UC-C03: List Contexts
  private async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, sortBy, order } = req.query;
      const query: ContextListQuery = {};
      if (page !== undefined) query.page = parseInt(String(page), 10);
      if (limit !== undefined) query.limit = parseInt(String(limit), 10);
      if (sortBy !== undefined) query.sortBy = String(sortBy) as ContextListQuery['sortBy'];
      if (order !== undefined) query.order = String(order) as 'asc' | 'desc';
      res.json(await this.listContexts.execute(query));
    } catch (err) {
      next(err);
    }
  }

  // UC-C02: Get Context
  private async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json(await this.getContext.execute({ id: req.params.id }));
    } catch (err) {
      next(err);
    }
  }

  // UC-C04: Update Context
  private async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json(await this.updateContext.execute({ id: req.params.id, title: req.body.title }));
    } catch (err) {
      next(err);
    }
  }

  // UC-C05: Delete Context
  private async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.deleteContext.execute({ id: req.params.id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
