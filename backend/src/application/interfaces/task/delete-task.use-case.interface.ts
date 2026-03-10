import { Injectable } from '../../../di-container/di-container-injectable';
import type { DeleteTaskInput } from '../../types/inputs/task/delete-task.input';
import type { DeleteTaskOutput } from '../../types/outputs/task/delete-task.output';
import type { IUseCase } from '../use-case.interface';

export const DELETE_TASK_USE_CASE = new Injectable<IDeleteTaskUseCase>('IDeleteTaskUseCase');

export interface IDeleteTaskUseCase extends IUseCase<DeleteTaskInput, DeleteTaskOutput> {}
