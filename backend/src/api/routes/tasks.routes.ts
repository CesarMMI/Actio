import { Router, Request, Response, NextFunction } from 'express';
import {
  CreateTaskUseCase,
  GetTaskUseCase,
  ListTasksUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  AssignChildTaskUseCase,
  RemoveChildTaskLinkUseCase,
} from '../../application';

export function tasksRouter(useCases: {
  createTask: CreateTaskUseCase;
  getTask: GetTaskUseCase;
  listTasks: ListTasksUseCase;
  updateTask: UpdateTaskUseCase;
  deleteTask: DeleteTaskUseCase;
  assignChildTask: AssignChildTaskUseCase;
  removeChildTaskLink: RemoveChildTaskLinkUseCase;
}): Router {
  const router = Router();

  // UC-T01: Create Task
  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await useCases.createTask.execute(req.body);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  });

  // UC-T03: List Tasks
  router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await useCases.listTasks.execute();
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  });

  // UC-T02: Get Task
  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await useCases.getTask.execute({ id: req.params.id });
      res.json(task);
    } catch (err) {
      next(err);
    }
  });

  // UC-T04: Update Task
  router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await useCases.updateTask.execute({ id: req.params.id, ...req.body });
      res.json(task);
    } catch (err) {
      next(err);
    }
  });

  // UC-T05: Delete Task
  router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await useCases.deleteTask.execute({ id: req.params.id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  // UC-T06: Assign Child Task
  router.post('/:id/child', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await useCases.assignChildTask.execute({
        parentId: req.params.id,
        childId: req.body.childId,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  // UC-T07: Remove Child Task Link
  router.delete('/:id/child', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await useCases.removeChildTaskLink.execute({ parentId: req.params.id });
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
