import { Injectable } from '../../../di-container/di-container-injectable';
import type { ReopenTaskInput } from '../../types/inputs/task/reopen-task.input';
import type { ReopenTaskOutput } from '../../types/outputs/task/reopen-task.output';
import type { IUseCase } from '../use-case.interface';

export const REOPEN_TASK_USE_CASE = new Injectable<IReopenTaskUseCase>('IReopenTaskUseCase');

export interface IReopenTaskUseCase extends IUseCase<ReopenTaskInput, ReopenTaskOutput> {}
