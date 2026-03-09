import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ActionOrmEntity } from '../entities/ActionOrmEntity';
import { CapturedItemOrmEntity } from '../entities/CapturedItemOrmEntity';
import { ContextOrmEntity } from '../entities/ContextOrmEntity';
import { ProjectOrmEntity } from '../entities/ProjectOrmEntity';

export const AppDataSource = new DataSource({
  type: 'sqljs',
  location: process.env.DB_PATH ?? 'actio.sqlite',
  autoSave: true,
  entities: [ActionOrmEntity, CapturedItemOrmEntity, ProjectOrmEntity, ContextOrmEntity],
  synchronize: process.env.NODE_ENV !== 'production',
});
