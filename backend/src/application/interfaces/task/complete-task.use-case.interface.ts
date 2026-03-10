import { Injectable } from '../../../di-container/di-container-injectable';
import type { CompleteTaskInput } from '../../types/inputs/task/complete-task.input';
import type { CompleteTaskOutput } from '../../types/outputs/task/complete-task.output';
import type { IUseCase } from '../use-case.interface';

export const COMPLETE_TASK_USE_CASE = new Injectable<ICompleteTaskUseCase>('ICompleteTaskUseCase');

export interface ICompleteTaskUseCase extends IUseCase<CompleteTaskInput, CompleteTaskOutput> {}
