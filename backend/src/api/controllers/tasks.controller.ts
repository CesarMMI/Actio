import { Router, Request, Response, NextFunction } from 'express';
import { ICompleteTaskUseCase } from '../../application/interfaces/task/complete-task.use-case.interface';
import { ICreateTaskUseCase } from '../../application/interfaces/task/create-task.use-case.interface';
import { IDeleteTaskUseCase } from '../../application/interfaces/task/delete-task.use-case.interface';
import { IGetTaskUseCase } from '../../application/interfaces/task/get-task.use-case.interface';
import { IListTasksUseCase } from '../../application/interfaces/task/list-tasks.use-case.interface';
import { IReopenTaskUseCase } from '../../application/interfaces/task/reopen-task.use-case.interface';
import { IUpdateTaskUseCase } from '../../application/interfaces/task/update-task.use-case.interface';
import type { TaskListQuery } from '../../domain/queries/task/task-list-query';
import { IController } from '../interfaces/controller.interface';

export class TasksController implements IController {
  readonly basePath = '/tasks';

  constructor(
    private readonly createTask: ICreateTaskUseCase,
    private readonly getTask: IGetTaskUseCase,
    private readonly listTasks: IListTasksUseCase,
    private readonly updateTask: IUpdateTaskUseCase,
    private readonly deleteTask: IDeleteTaskUseCase,
    private readonly completeTask: ICompleteTaskUseCase,
    private readonly reopenTask: IReopenTaskUseCase,
  ) {}

  registerRoutes(router: Router): void {
    router.post('/', this.create.bind(this));
    router.get('/', this.list.bind(this));
    router.get('/:id', this.get.bind(this));
    router.patch('/:id', this.update.bind(this));
    router.delete('/:id', this.delete.bind(this));
    router.post('/:id/complete', this.complete.bind(this));
    router.post('/:id/reopen', this.reopen.bind(this));
  }

  // UC-T01: Create Task
  private async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { description, contextId, projectId } = req.body;
      res.status(201).json(await this.createTask.execute({
        description,
        contextId: contextId ?? undefined,
        projectId: projectId ?? undefined,
      }));
    } catch (err) {
      next(err);
    }
  }

  // UC-T03: List Tasks
  private async list(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      res.json(await this.listTasks.execute(query));
    } catch (err) {
      next(err);
    }
  }

  // UC-T02: Get Task
  private async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json(await this.getTask.execute({ id: req.params.id }));
    } catch (err) {
      next(err);
    }
  }

  // UC-T04: Update Task
  private async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { description, contextId, projectId } = req.body;
      res.json(await this.updateTask.execute({
        id: req.params.id,
        ...(description !== undefined && { description }),
        ...(contextId !== undefined && { contextId: contextId ?? null }),
        ...(projectId !== undefined && { projectId: projectId ?? null }),
      }));
    } catch (err) {
      next(err);
    }
  }

  // UC-T05: Delete Task
  private async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.deleteTask.execute({ id: req.params.id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  // UC-T06: Complete Task
  private async complete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json(await this.completeTask.execute({ id: req.params.id }));
    } catch (err) {
      next(err);
    }
  }

  // UC-T07: Reopen Task
  private async reopen(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json(await this.reopenTask.execute({ id: req.params.id }));
    } catch (err) {
      next(err);
    }
  }
}
