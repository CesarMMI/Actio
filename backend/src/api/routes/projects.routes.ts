import { NextFunction, Request, Response, Router } from 'express';
import { ICreateProjectUseCase } from '../../application/interfaces/project/create-project.use-case.interface';
import { IDeleteProjectUseCase } from '../../application/interfaces/project/delete-project.use-case.interface';
import { IGetProjectUseCase } from '../../application/interfaces/project/get-project.use-case.interface';
import { IListProjectsUseCase } from '../../application/interfaces/project/list-projects.use-case.interface';
import { IUpdateProjectUseCase } from '../../application/interfaces/project/update-project.use-case.interface';
import type { ProjectListQuery } from '../../domain/interfaces/project-list-query';

export function projectsRouter(useCases: {
  createProject: ICreateProjectUseCase;
  getProject: IGetProjectUseCase;
  listProjects: IListProjectsUseCase;
  updateProject: IUpdateProjectUseCase;
  deleteProject: IDeleteProjectUseCase;
}): Router {
  const router = Router();
  // UC-P01: Create Project
  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(await useCases.createProject.execute(req.body));
    } catch (err) {
      next(err);
    }
  });
  // UC-P03: List Projects
  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, sortBy, order } = req.query;
      const query: ProjectListQuery = {};
      if (page !== undefined) query.page = parseInt(String(page), 10);
      if (limit !== undefined) query.limit = parseInt(String(limit), 10);
      if (sortBy !== undefined) query.sortBy = String(sortBy) as ProjectListQuery['sortBy'];
      if (order !== undefined) query.order = String(order) as 'asc' | 'desc';
      res.json(await useCases.listProjects.execute(query));
    } catch (err) {
      next(err);
    }
  });
  // UC-P02: Get Project
  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await useCases.getProject.execute({ id: req.params.id }));
    } catch (err) {
      next(err);
    }
  });
  // UC-P04: Update Project
  router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await useCases.updateProject.execute({ id: req.params.id, title: req.body.title }));
    } catch (err) {
      next(err);
    }
  });
  // UC-P05: Delete Project
  router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await useCases.deleteProject.execute({ id: req.params.id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });
  return router;
}
