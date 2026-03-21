import cors from "cors";
import express, { Router } from "express";
import { CREATE_CONTEXT_USE_CASE } from "../application/interfaces/context/create-context.use-case.interface";
import { DELETE_CONTEXT_USE_CASE } from "../application/interfaces/context/delete-context.use-case.interface";
import { GET_CONTEXT_USE_CASE } from "../application/interfaces/context/get-context.use-case.interface";
import { LIST_CONTEXTS_USE_CASE } from "../application/interfaces/context/list-contexts.use-case.interface";
import { UPDATE_CONTEXT_USE_CASE } from "../application/interfaces/context/update-context.use-case.interface";
import { CREATE_PROJECT_USE_CASE } from "../application/interfaces/project/create-project.use-case.interface";
import { DELETE_PROJECT_USE_CASE } from "../application/interfaces/project/delete-project.use-case.interface";
import { GET_PROJECT_USE_CASE } from "../application/interfaces/project/get-project.use-case.interface";
import { LIST_PROJECTS_USE_CASE } from "../application/interfaces/project/list-projects.use-case.interface";
import { UPDATE_PROJECT_USE_CASE } from "../application/interfaces/project/update-project.use-case.interface";
import { COMPLETE_TASK_USE_CASE } from "../application/interfaces/task/complete-task.use-case.interface";
import { CREATE_TASK_USE_CASE } from "../application/interfaces/task/create-task.use-case.interface";
import { DELETE_TASK_USE_CASE } from "../application/interfaces/task/delete-task.use-case.interface";
import { GET_TASK_USE_CASE } from "../application/interfaces/task/get-task.use-case.interface";
import { LIST_TASKS_USE_CASE } from "../application/interfaces/task/list-tasks.use-case.interface";
import { REOPEN_TASK_USE_CASE } from "../application/interfaces/task/reopen-task.use-case.interface";
import { UPDATE_TASK_USE_CASE } from "../application/interfaces/task/update-task.use-case.interface";
import { Injector } from "../di-container/di-container-injector";
import { ContextsController } from "./controllers/contexts.controller";
import { ProjectsController } from "./controllers/projects.controller";
import { TasksController } from "./controllers/tasks.controller";
import { CONTROLLERS } from "./interfaces/controller.interface";
import { errorHandler } from "./middleware/error-handler";

export const injectApi: Injector = async (container, env) => {
  const app = express();
  const port = env.PORT ? parseInt(env.PORT) : 3000;

  app.use(cors());
  app.use(express.json());

  container.bindMany(CONTROLLERS, new TasksController(
    container.resolve(CREATE_TASK_USE_CASE),
    container.resolve(GET_TASK_USE_CASE),
    container.resolve(LIST_TASKS_USE_CASE),
    container.resolve(UPDATE_TASK_USE_CASE),
    container.resolve(DELETE_TASK_USE_CASE),
    container.resolve(COMPLETE_TASK_USE_CASE),
    container.resolve(REOPEN_TASK_USE_CASE),
  ));
  container.bindMany(CONTROLLERS, new ContextsController(
    container.resolve(CREATE_CONTEXT_USE_CASE),
    container.resolve(GET_CONTEXT_USE_CASE),
    container.resolve(LIST_CONTEXTS_USE_CASE),
    container.resolve(UPDATE_CONTEXT_USE_CASE),
    container.resolve(DELETE_CONTEXT_USE_CASE),
  ));
  container.bindMany(CONTROLLERS, new ProjectsController(
    container.resolve(CREATE_PROJECT_USE_CASE),
    container.resolve(GET_PROJECT_USE_CASE),
    container.resolve(LIST_PROJECTS_USE_CASE),
    container.resolve(UPDATE_PROJECT_USE_CASE),
    container.resolve(DELETE_PROJECT_USE_CASE),
  ));

  for (const controller of container.resolve(CONTROLLERS)) {
    const router = Router();
    controller.registerRoutes(router);
    app.use(controller.basePath, router);
  }

  app.use(errorHandler);

  app.listen(port, () => console.log(`Actio API running on http://localhost:${port}`));
  return container;
};
