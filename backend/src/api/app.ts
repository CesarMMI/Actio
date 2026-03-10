import express from "express";
import cors from "cors";
import { DataSource } from "typeorm";
import { buildContainer } from "./di-container";
import { tasksRouter } from "./routes/tasks.routes";
import { projectsRouter } from "./routes/projects.routes";
import { contextsRouter } from "./routes/contexts.routes";
import { errorHandler } from "./middleware/error-handler";

export function createApp(dataSource: DataSource) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const uc = buildContainer(dataSource);

  app.use("/tasks", tasksRouter(uc));
  app.use("/projects", projectsRouter(uc));
  app.use("/contexts", contextsRouter(uc));

  app.use(errorHandler);

  return app;
}
