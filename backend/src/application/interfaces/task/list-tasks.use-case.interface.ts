import { Injectable } from '../../../di-container/di-container-injectable';
import type { ListTasksInput } from '../../types/inputs/task/list-tasks.input';
import type { ListTasksOutput } from '../../types/outputs/task/list-tasks.output';
import type { IUseCase } from '../use-case.interface';

export const LIST_TASKS_USE_CASE = new Injectable<IListTasksUseCase>('IListTasksUseCase');

export interface IListTasksUseCase extends IUseCase<ListTasksInput, ListTasksOutput> {}
