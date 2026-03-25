import "reflect-metadata";
import { DataSource } from "typeorm";
import { ContextOrmEntity } from "../entities/context.orm-entity";
import { ProjectOrmEntity } from "../entities/project.orm-entity";
import { TaskOrmEntity } from "../entities/task.orm-entity";
import { RefreshTokenOrmEntity } from "../entities/refresh-token.orm-entity";
import { UserOrmEntity } from "../entities/user.orm-entity";

export class SqliteDataSource extends DataSource {
  constructor(env: NodeJS.ProcessEnv) {
    super({
      type: "sqljs",
      location: env.DB_PATH ?? "actio.sqlite",
      autoSave: true,
      entities: [ContextOrmEntity, ProjectOrmEntity, TaskOrmEntity, UserOrmEntity, RefreshTokenOrmEntity],
      synchronize: env.NODE_ENV !== "production",
    });
  }
}
