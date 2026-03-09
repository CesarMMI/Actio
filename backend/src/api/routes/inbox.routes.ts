import { Router, Request, Response, NextFunction } from 'express';
import {
  IQuickCaptureUseCase,
  ICaptureAndResolveUseCase,
  IViewInboxUseCase,
  IClarifyAsActionUseCase,
  IClarifyAsProjectUseCase,
  IClarifyAsReferenceUseCase,
  IClarifyAsSomedayUseCase,
  IMoveToTrashUseCase,
} from '../../application';

export function inboxRouter(useCases: {
  quickCapture: IQuickCaptureUseCase;
  captureAndResolve: ICaptureAndResolveUseCase;
  viewInbox: IViewInboxUseCase;
  clarifyAsAction: IClarifyAsActionUseCase;
  clarifyAsProject: IClarifyAsProjectUseCase;
  clarifyAsReference: IClarifyAsReferenceUseCase;
  clarifyAsSomeday: IClarifyAsSomedayUseCase;
  moveToTrash: IMoveToTrashUseCase;
}): Router {
  const router = Router();

  // UC-01: Quick Capture
  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await useCases.quickCapture.execute(req.body);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  });

  // UC-02: Capture + Resolve Inline
  router.post('/capture-resolve', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await useCases.captureAndResolve.execute(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  });

  // UC-03: View Inbox
  router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await useCases.viewInbox.execute();
      res.json(items);
    } catch (err) {
      next(err);
    }
  });

  // UC-04: Clarify as Action
  router.post('/:id/clarify-as-action', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const action = await useCases.clarifyAsAction.execute({
        capturedItemId: req.params.id,
        ...req.body,
      });
      res.status(201).json(action);
    } catch (err) {
      next(err);
    }
  });

  // UC-05: Clarify as Project
  router.post('/:id/clarify-as-project', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await useCases.clarifyAsProject.execute({
        capturedItemId: req.params.id,
        ...req.body,
      });
      res.status(201).json(project);
    } catch (err) {
      next(err);
    }
  });

  // UC-06: Clarify as Reference
  router.post('/:id/clarify-as-reference', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await useCases.clarifyAsReference.execute(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  // UC-07: Clarify as Someday/Maybe
  router.post('/:id/clarify-as-someday', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await useCases.clarifyAsSomeday.execute(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  // UC-08: Move to Trash
  router.post('/:id/trash', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await useCases.moveToTrash.execute(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  return router;
}
