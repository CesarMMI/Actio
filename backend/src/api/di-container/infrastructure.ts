import { DataSource } from 'typeorm';
import { ICapturedItemRepository, IActionRepository, IProjectRepository, IContextRepository } from '../../domain/interfaces';
import {
  TypeOrmCapturedItemRepository,
  TypeOrmActionRepository,
  TypeOrmProjectRepository,
  TypeOrmContextRepository,
} from '../../infrastructure';

export interface Repositories {
  capturedItems: ICapturedItemRepository;
  actions: IActionRepository;
  projects: IProjectRepository;
  contexts: IContextRepository;
}

export function buildRepositories(dataSource: DataSource): Repositories {
  return {
    capturedItems: new TypeOrmCapturedItemRepository(dataSource),
    actions: new TypeOrmActionRepository(dataSource),
    projects: new TypeOrmProjectRepository(dataSource),
    contexts: new TypeOrmContextRepository(dataSource),
  };
}
