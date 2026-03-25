import { PASSWORD_SERVICE } from "../application/interfaces/password-service.interface";
import { TOKEN_SERVICE } from "../application/interfaces/token-service.interface";
import { Injector } from "../di-container/di-container-injector";
import { CONTEXT_REPOSITORY } from "../domain/interfaces/context-repository.interface";
import { PROJECT_REPOSITORY } from "../domain/interfaces/project-repository.interface";
import { TASK_REPOSITORY } from "../domain/interfaces/task-repository.interface";
import { REFRESH_TOKEN_REPOSITORY } from "../domain/interfaces/refresh-token-repository.interface";
import { USER_REPOSITORY } from "../domain/interfaces/user-repository.interface";
import { SqliteDataSource } from "./database/sqlite.data-source";
import { TypeOrmContextRepository } from "./repositories/type-orm-context.repository";
import { TypeOrmProjectRepository } from "./repositories/type-orm-project.repository";
import { TypeOrmRefreshTokenRepository } from "./repositories/type-orm-refresh-token.repository";
import { TypeOrmTaskRepository } from "./repositories/type-orm-task.repository";
import { TypeOrmUserRepository } from "./repositories/type-orm-user.repository";
import { BcryptPasswordService } from "./services/bcrypt-password.service";
import { JwtTokenService } from "./services/jwt-token.service";

export const injectInfrastructure: Injector = async (container, env) => {
  const dataSource = await new SqliteDataSource(env).initialize();
  container.bind(CONTEXT_REPOSITORY, new TypeOrmContextRepository(dataSource));
  container.bind(PROJECT_REPOSITORY, new TypeOrmProjectRepository(dataSource));
  container.bind(TASK_REPOSITORY, new TypeOrmTaskRepository(dataSource));
  container.bind(USER_REPOSITORY, new TypeOrmUserRepository(dataSource));
  container.bind(REFRESH_TOKEN_REPOSITORY, new TypeOrmRefreshTokenRepository(dataSource));
  container.bind(TOKEN_SERVICE, new JwtTokenService(env));
  container.bind(PASSWORD_SERVICE, new BcryptPasswordService(env));
  return container;
};
