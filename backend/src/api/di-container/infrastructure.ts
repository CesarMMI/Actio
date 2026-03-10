import { DataSource } from 'typeorm';
import { IContextRepository, IProjectRepository, ITaskRepository } from '../../domain/interfaces';
import {
  TypeOrmContextRepository,
  TypeOrmProjectRepository,
  TypeOrmTaskRepository,
} from '../../infrastructure';

export interface Repositories {
  contexts: IContextRepository;
  projects: IProjectRepository;
  tasks: ITaskRepository;
}

export function buildRepositories(dataSource: DataSource): Repositories {
  return {
    contexts: new TypeOrmContextRepository(dataSource),
    projects: new TypeOrmProjectRepository(dataSource),
    tasks: new TypeOrmTaskRepository(dataSource),
  };
}
