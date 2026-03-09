import express from "express";
import { DataSource } from "typeorm";
import { buildContainer } from "./di-container";
import { inboxRouter } from "./routes/inbox.routes";
import { actionsRouter } from "./routes/actions.routes";
import { projectsRouter } from "./routes/projects.routes";
import { contextsRouter } from "./routes/contexts.routes";
import { errorHandler } from "./middleware/error-handler";

export function createApp(dataSource: DataSource) {
  const app = express();
  app.use(express.json());

  const uc = buildContainer(dataSource);

  app.use("/inbox", inboxRouter(uc));
  app.use("/actions", actionsRouter(uc));
  app.use("/projects", projectsRouter(uc));
  app.use("/contexts", contextsRouter(uc));

  app.use(errorHandler);

  return app;
}
