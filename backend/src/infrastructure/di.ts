import { Injector } from "../di-container/di-container-injector";
import { CONTEXT_REPOSITORY } from "../domain/interfaces/context-repository.interface";
import { PROJECT_REPOSITORY } from "../domain/interfaces/project-repository.interface";
import { TASK_REPOSITORY } from "../domain/interfaces/task-repository.interface";
import { SqliteDataSource } from "./database/sqlite.data-source";
import { TypeOrmContextRepository } from "./repositories/type-orm-context.repository";
import { TypeOrmProjectRepository } from "./repositories/type-orm-project.repository";
import { TypeOrmTaskRepository } from "./repositories/type-orm-task.repository";

export const injectInfrastructure: Injector = async (container, env) => {
  const dataSource = await new SqliteDataSource(env).initialize();
  container.bind(CONTEXT_REPOSITORY, new TypeOrmContextRepository(dataSource));
  container.bind(PROJECT_REPOSITORY, new TypeOrmProjectRepository(dataSource));
  container.bind(TASK_REPOSITORY, new TypeOrmTaskRepository(dataSource));
  return container;
};
