import { Router, Request, Response, NextFunction } from 'express';
import { ICreateProjectUseCase } from '../../application/interfaces/project/create-project.use-case.interface';
import { IDeleteProjectUseCase } from '../../application/interfaces/project/delete-project.use-case.interface';
import { IGetProjectUseCase } from '../../application/interfaces/project/get-project.use-case.interface';
import { IListProjectsUseCase } from '../../application/interfaces/project/list-projects.use-case.interface';
import { IUpdateProjectUseCase } from '../../application/interfaces/project/update-project.use-case.interface';
import type { ProjectListQuery } from '../../domain/queries/project/project-list-query';
import { IController } from '../interfaces/controller.interface';

export class ProjectsController implements IController {
  readonly basePath = '/projects';

  constructor(
    private readonly createProject: ICreateProjectUseCase,
    private readonly getProject: IGetProjectUseCase,
    private readonly listProjects: IListProjectsUseCase,
    private readonly updateProject: IUpdateProjectUseCase,
    private readonly deleteProject: IDeleteProjectUseCase,
  ) {}

  registerRoutes(router: Router): void {
    router.post('/', this.create.bind(this));
    router.get('/', this.list.bind(this));
    router.get('/:id', this.get.bind(this));
    router.patch('/:id', this.update.bind(this));
    router.delete('/:id', this.delete.bind(this));
  }

  // UC-P01: Create Project
  private async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(201).json(await this.createProject.execute(req.body));
    } catch (err) {
      next(err);
    }
  }

  // UC-P03: List Projects
  private async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, sortBy, order } = req.query;
      const query: ProjectListQuery = {};
      if (page !== undefined) query.page = parseInt(String(page), 10);
      if (limit !== undefined) query.limit = parseInt(String(limit), 10);
      if (sortBy !== undefined) query.sortBy = String(sortBy) as ProjectListQuery['sortBy'];
      if (order !== undefined) query.order = String(order) as 'asc' | 'desc';
      res.json(await this.listProjects.execute(query));
    } catch (err) {
      next(err);
    }
  }

  // UC-P02: Get Project
  private async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json(await this.getProject.execute({ id: req.params.id }));
    } catch (err) {
      next(err);
    }
  }

  // UC-P04: Update Project
  private async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json(await this.updateProject.execute({ id: req.params.id, title: req.body.title }));
    } catch (err) {
      next(err);
    }
  }

  // UC-P05: Delete Project
  private async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.deleteProject.execute({ id: req.params.id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
