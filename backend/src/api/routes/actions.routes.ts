import { Router, Request, Response, NextFunction } from 'express';
import {
  IViewActionsUseCase,
  IAssignActionToProjectUseCase,
  IAssignActionToContextUseCase,
  ICompleteActionUseCase,
  IArchiveActionUseCase,
} from '../../application';
import { ActionFilters } from '../../domain/interfaces';
import { ActionStatus, TimeBucket, EnergyLevel } from '../../domain/enums';

export function actionsRouter(useCases: {
  viewActions: IViewActionsUseCase;
  assignActionToProject: IAssignActionToProjectUseCase;
  assignActionToContext: IAssignActionToContextUseCase;
  completeAction: ICompleteActionUseCase;
  archiveAction: IArchiveActionUseCase;
}): Router {
  const router = Router();

  // UC-09: View Actions with filters
  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters: ActionFilters = {};
      if (req.query.contextId) filters.contextId = req.query.contextId as string;
      if (req.query.projectId) filters.projectId = req.query.projectId as string;
      if (req.query.timeBucket) filters.timeBucket = req.query.timeBucket as TimeBucket;
      if (req.query.energyLevel) filters.energyLevel = req.query.energyLevel as EnergyLevel;
      if (req.query.dueBefore) filters.dueBefore = new Date(req.query.dueBefore as string);
      if (req.query.status) filters.status = req.query.status as ActionStatus;

      const actions = await useCases.viewActions.execute(filters);
      res.json(actions);
    } catch (err) {
      next(err);
    }
  });

  // UC-10: Assign Action to Project
  router.patch('/:id/project', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await useCases.assignActionToProject.execute({
        actionId: req.params.id,
        projectId: req.body.projectId ?? null,
      });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  // UC-11: Assign Action to Context
  router.patch('/:id/context', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await useCases.assignActionToContext.execute({
        actionId: req.params.id,
        contextId: req.body.contextId ?? null,
      });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  // UC-12: Complete an Action
  router.post('/:id/complete', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await useCases.completeAction.execute(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  // UC-13: Archive an Action
  router.post('/:id/archive', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await useCases.archiveAction.execute(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  return router;
}
