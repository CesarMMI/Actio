import { Injectable } from '../../../di-container/di-container-injectable';
import type { CreateTaskInput } from '../../types/inputs/task/create-task.input';
import type { CreateTaskOutput } from '../../types/outputs/task/create-task.output';
import type { IUseCase } from '../use-case.interface';

export const CREATE_TASK_USE_CASE = new Injectable<ICreateTaskUseCase>('ICreateTaskUseCase');

export interface ICreateTaskUseCase extends IUseCase<CreateTaskInput, CreateTaskOutput> {}
