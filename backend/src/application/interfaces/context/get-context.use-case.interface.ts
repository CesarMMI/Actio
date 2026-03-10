import { Injectable } from '../../../di-container/di-container-injectable';
import type { GetContextInput } from '../../types/inputs/context/get-context.input';
import type { GetContextOutput } from '../../types/outputs/context/get-context.output';
import type { IUseCase } from '../use-case.interface';

export const GET_CONTEXT_USE_CASE = new Injectable<IGetContextUseCase>('IGetContextUseCase');

export interface IGetContextUseCase extends IUseCase<GetContextInput, GetContextOutput> {}
