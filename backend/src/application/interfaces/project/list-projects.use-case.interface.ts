import { Injectable } from '../../../di-container/di-container-injectable';
import type { ListProjectsInput } from '../../types/inputs/project/list-projects.input';
import type { ListProjectsOutput } from '../../types/outputs/project/list-projects.output';
import type { IUseCase } from '../use-case.interface';

export const LIST_PROJECTS_USE_CASE = new Injectable<IListProjectsUseCase>('IListProjectsUseCase');

export interface IListProjectsUseCase extends IUseCase<ListProjectsInput, ListProjectsOutput> {}
