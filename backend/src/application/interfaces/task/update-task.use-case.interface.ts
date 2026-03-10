import { Injectable } from '../../../di-container/di-container-injectable';
import type { UpdateTaskInput } from '../../types/inputs/task/update-task.input';
import type { UpdateTaskOutput } from '../../types/outputs/task/update-task.output';
import type { IUseCase } from '../use-case.interface';

export const UPDATE_TASK_USE_CASE = new Injectable<IUpdateTaskUseCase>('IUpdateTaskUseCase');

export interface IUpdateTaskUseCase extends IUseCase<UpdateTaskInput, UpdateTaskOutput> {}
