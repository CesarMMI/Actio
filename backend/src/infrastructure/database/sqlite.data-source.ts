import "reflect-metadata";
import { DataSource } from "typeorm";
import { ContextOrmEntity } from "../entities/ContextOrmEntity";
import { ProjectOrmEntity } from "../entities/ProjectOrmEntity";
import { TaskOrmEntity } from "../entities/TaskOrmEntity";

export class SqliteDataSource extends DataSource {
  constructor(env: NodeJS.ProcessEnv) {
    super({
      type: "sqljs",
      location: env.DB_PATH ?? "actio.sqlite",
      autoSave: true,
      entities: [ContextOrmEntity, ProjectOrmEntity, TaskOrmEntity],
      synchronize: env.NODE_ENV !== "production",
    });
  }
}
