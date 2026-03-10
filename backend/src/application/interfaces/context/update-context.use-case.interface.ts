import { Injectable } from '../../../di-container/di-container-injectable';
import type { UpdateContextInput } from '../../types/inputs/context/update-context.input';
import type { UpdateContextOutput } from '../../types/outputs/context/update-context.output';
import type { IUseCase } from '../use-case.interface';

export const UPDATE_CONTEXT_USE_CASE = new Injectable<IUpdateContextUseCase>('IUpdateContextUseCase');

export interface IUpdateContextUseCase extends IUseCase<UpdateContextInput, UpdateContextOutput> {}
