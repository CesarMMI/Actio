import { Router, Request, Response, NextFunction } from 'express';
import {
  ICreateContextUseCase,
  IRenameContextUseCase,
  IActivateContextUseCase,
  IDeactivateContextUseCase,
  IExecuteByContextUseCase,
} from '../../application';

export function contextsRouter(useCases: {
  createContext: ICreateContextUseCase;
  renameContext: IRenameContextUseCase;
  activateContext: IActivateContextUseCase;
  deactivateContext: IDeactivateContextUseCase;
  executeByContext: IExecuteByContextUseCase;
}): Router {
  const router = Router();

  // UC-18: Create a Context
  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const context = await useCases.createContext.execute(req.body);
      res.status(201).json(context);
    } catch (err) {
      next(err);
    }
  });

  // UC-19: Rename a Context
  router.patch('/:id/name', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await useCases.renameContext.execute({ contextId: req.params.id, name: req.body.name });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  // UC-21: Activate a Context
  router.post('/:id/activate', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await useCases.activateContext.execute(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  // UC-20: Deactivate a Context
  router.post('/:id/deactivate', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await useCases.deactivateContext.execute(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  // UC-22: Execute by Context
  router.get('/:id/actions', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actions = await useCases.executeByContext.execute(req.params.id);
      res.json(actions);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
