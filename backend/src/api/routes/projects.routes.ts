import { Router, Request, Response, NextFunction } from 'express';
import {
  IViewProjectUseCase,
  IRenameProjectUseCase,
  ICompleteProjectUseCase,
  IArchiveProjectUseCase,
} from '../../application';

export function projectsRouter(useCases: {
  viewProject: IViewProjectUseCase;
  renameProject: IRenameProjectUseCase;
  completeProject: ICompleteProjectUseCase;
  archiveProject: IArchiveProjectUseCase;
}): Router {
  const router = Router();

  // UC-14: View Project
  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await useCases.viewProject.execute(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  // UC-15: Rename Project
  router.patch('/:id/name', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await useCases.renameProject.execute({ projectId: req.params.id, name: req.body.name });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  // UC-16: Complete a Project
  router.post('/:id/complete', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await useCases.completeProject.execute(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  // UC-17: Archive a Project
  router.post('/:id/archive', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await useCases.archiveProject.execute(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  return router;
}
