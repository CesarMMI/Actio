import { Router, Request, Response, NextFunction } from 'express';
import {
  CreateProjectUseCase,
  GetProjectUseCase,
  ListProjectsUseCase,
  UpdateProjectUseCase,
  DeleteProjectUseCase,
} from '../../application';

export function projectsRouter(useCases: {
  createProject: CreateProjectUseCase;
  getProject: GetProjectUseCase;
  listProjects: ListProjectsUseCase;
  updateProject: UpdateProjectUseCase;
  deleteProject: DeleteProjectUseCase;
}): Router {
  const router = Router();

  // UC-P01: Create Project
  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await useCases.createProject.execute(req.body);
      res.status(201).json(project);
    } catch (err) {
      next(err);
    }
  });

  // UC-P03: List Projects
  router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const projects = await useCases.listProjects.execute();
      res.json(projects);
    } catch (err) {
      next(err);
    }
  });

  // UC-P02: Get Project
  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await useCases.getProject.execute({ id: req.params.id });
      res.json(project);
    } catch (err) {
      next(err);
    }
  });

  // UC-P04: Update Project
  router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await useCases.updateProject.execute({ id: req.params.id, title: req.body.title });
      res.json(project);
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
