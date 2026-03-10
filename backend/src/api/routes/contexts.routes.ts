import { Router, Request, Response, NextFunction } from 'express';
import {
  CreateContextUseCase,
  GetContextUseCase,
  ListContextsUseCase,
  UpdateContextUseCase,
  DeleteContextUseCase,
} from '../../application';

export function contextsRouter(useCases: {
  createContext: CreateContextUseCase;
  getContext: GetContextUseCase;
  listContexts: ListContextsUseCase;
  updateContext: UpdateContextUseCase;
  deleteContext: DeleteContextUseCase;
}): Router {
  const router = Router();

  // UC-C01: Create Context
  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const context = await useCases.createContext.execute(req.body);
      res.status(201).json(context);
    } catch (err) {
      next(err);
    }
  });

  // UC-C03: List Contexts
  router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const contexts = await useCases.listContexts.execute();
      res.json(contexts);
    } catch (err) {
      next(err);
    }
  });

  // UC-C02: Get Context
  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const context = await useCases.getContext.execute({ id: req.params.id });
      res.json(context);
    } catch (err) {
      next(err);
    }
  });

  // UC-C04: Update Context
  router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const context = await useCases.updateContext.execute({ id: req.params.id, title: req.body.title });
      res.json(context);
    } catch (err) {
      next(err);
    }
  });

  // UC-C05: Delete Context
  router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await useCases.deleteContext.execute({ id: req.params.id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  return router;
}
