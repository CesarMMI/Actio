import { DataSource } from 'typeorm';
import { buildRepositories } from './infrastructure';
import { buildUseCases, UseCases } from './application';

export type { UseCases };

export function buildContainer(dataSource: DataSource): UseCases {
  const repos = buildRepositories(dataSource);
  return buildUseCases(repos);
}
