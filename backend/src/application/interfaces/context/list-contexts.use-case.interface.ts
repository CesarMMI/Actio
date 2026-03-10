import { Injectable } from '../../../di-container/di-container-injectable';
import type { ListContextsInput } from '../../types/inputs/context/list-contexts.input';
import type { ListContextsOutput } from '../../types/outputs/context/list-contexts.output';
import type { IUseCase } from '../use-case.interface';

export const LIST_CONTEXTS_USE_CASE = new Injectable<IListContextsUseCase>('IListContextsUseCase');

export interface IListContextsUseCase extends IUseCase<ListContextsInput, ListContextsOutput> {}
