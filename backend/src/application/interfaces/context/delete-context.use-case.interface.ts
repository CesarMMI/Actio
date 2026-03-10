import { Injectable } from '../../../di-container/di-container-injectable';
import type { DeleteContextInput } from '../../types/inputs/context/delete-context.input';
import type { DeleteContextOutput } from '../../types/outputs/context/delete-context.output';
import type { IUseCase } from '../use-case.interface';

export const DELETE_CONTEXT_USE_CASE = new Injectable<IDeleteContextUseCase>('IDeleteContextUseCase');

export interface IDeleteContextUseCase extends IUseCase<DeleteContextInput, DeleteContextOutput> {}
