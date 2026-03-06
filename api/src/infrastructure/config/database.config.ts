import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserOrmEntity } from '../persistence/orm-entities/user.orm-entity';
import { CapturedItemOrmEntity } from '../persistence/orm-entities/captured-item.orm-entity';
import { ActionOrmEntity } from '../persistence/orm-entities/action.orm-entity';
import { ProjectOrmEntity } from '../persistence/orm-entities/project.orm-entity';
import { ContextOrmEntity } from '../persistence/orm-entities/context.orm-entity';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const isTest = process.env.NODE_ENV === 'test';

  if (isTest) {
    return {
      type: 'sqlite',
      database: ':memory:',
      entities: [
        UserOrmEntity,
        CapturedItemOrmEntity,
        ActionOrmEntity,
        ProjectOrmEntity,
        ContextOrmEntity,
      ],
      synchronize: true,
      dropSchema: true,
    };
  }

  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'actio',
    entities: [
      UserOrmEntity,
      CapturedItemOrmEntity,
      ActionOrmEntity,
      ProjectOrmEntity,
      ContextOrmEntity,
    ],
    synchronize: false, // Use migrations instead
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsRun: true,
  };
};
