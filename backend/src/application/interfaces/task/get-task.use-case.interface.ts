import { Injectable } from '../../../di-container/di-container-injectable';
import type { GetTaskInput } from '../../types/inputs/task/get-task.input';
import type { GetTaskOutput } from '../../types/outputs/task/get-task.output';
import type { IUseCase } from '../use-case.interface';

export const GET_TASK_USE_CASE = new Injectable<IGetTaskUseCase>('IGetTaskUseCase');

export interface IGetTaskUseCase extends IUseCase<GetTaskInput, GetTaskOutput> {}
