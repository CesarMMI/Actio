import { Router, Request, Response, NextFunction } from 'express';
import { ICompleteTaskUseCase } from '../../application/interfaces/task/complete-task.use-case.interface';
import { ICreateTaskUseCase } from '../../application/interfaces/task/create-task.use-case.interface';
import { IDeleteTaskUseCase } from '../../application/interfaces/task/delete-task.use-case.interface';
import { IGetTaskUseCase } from '../../application/interfaces/task/get-task.use-case.interface';
import { IListTasksUseCase } from '../../application/interfaces/task/list-tasks.use-case.interface';
import { IReopenTaskUseCase } from '../../application/interfaces/task/reopen-task.use-case.interface';
import { IUpdateTaskUseCase } from '../../application/interfaces/task/update-task.use-case.interface';
import type { TaskListQuery } from '../../domain/interfaces/task-list-query';

export function tasksRouter(useCases: {
  createTask: ICreateTaskUseCase;
  getTask: IGetTaskUseCase;
  listTasks: IListTasksUseCase;
  updateTask: IUpdateTaskUseCase;
  deleteTask: IDeleteTaskUseCase;
  completeTask: ICompleteTaskUseCase;
  reopenTask: IReopenTaskUseCase;
}): Router {
  const router = Router();
  // UC-T01: Create Task
  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { description, contextId, projectId } = req.body;
      res.status(201).json(await useCases.createTask.execute({
        description,
        contextId: contextId ?? undefined,
        projectId: projectId ?? undefined,
      }));
    } catch (err) {
      next(err);
    }
  });
  // UC-T03: List Tasks
  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { done, contextId, projectId, page, limit, sortBy, order } = req.query;
      const query: TaskListQuery = {};
      if (done !== undefined) query.done = done === 'true';
      if (contextId !== undefined) query.contextId = String(contextId);
      if (projectId !== undefined) query.projectId = String(projectId);
      if (page !== undefined) query.page = parseInt(String(page), 10);
      if (limit !== undefined) query.limit = parseInt(String(limit), 10);
      if (sortBy !== undefined) query.sortBy = String(sortBy) as TaskListQuery['sortBy'];
      if (order !== undefined) query.order = String(order) as 'asc' | 'desc';
      res.json(await useCases.listTasks.execute(query));
    } catch (err) {
      next(err);
    }
  });
  // UC-T02: Get Task
  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await useCases.getTask.execute({ id: req.params.id }));
    } catch (err) {
      next(err);
    }
  });
  // UC-T04: Update Task
  router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { description, contextId, projectId } = req.body;
      res.json(await useCases.updateTask.execute({
        id: req.params.id,
        ...(description !== undefined && { description }),
        ...(contextId !== undefined && { contextId: contextId ?? null }),
        ...(projectId !== undefined && { projectId: projectId ?? null }),
      }));
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
  // UC-T06: Complete Task
  router.post('/:id/complete', async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await useCases.completeTask.execute({ id: req.params.id }));
    } catch (err) {
      next(err);
    }
  });
  // UC-T07: Reopen Task
  router.post('/:id/reopen', async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await useCases.reopenTask.execute({ id: req.params.id }));
    } catch (err) {
      next(err);
    }
  });
  return router;
}
