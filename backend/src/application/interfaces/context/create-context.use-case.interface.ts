import { Injectable } from '../../../di-container/di-container-injectable';
import type { CreateContextInput } from '../../types/inputs/context/create-context.input';
import type { CreateContextOutput } from '../../types/outputs/context/create-context.output';
import type { IUseCase } from '../use-case.interface';

export const CREATE_CONTEXT_USE_CASE = new Injectable<ICreateContextUseCase>('ICreateContextUseCase');

export interface ICreateContextUseCase extends IUseCase<CreateContextInput, CreateContextOutput> {}
