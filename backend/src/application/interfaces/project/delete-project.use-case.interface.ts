import { Injectable } from '../../../di-container/di-container-injectable';
import type { DeleteProjectInput } from '../../types/inputs/project/delete-project.input';
import type { DeleteProjectOutput } from '../../types/outputs/project/delete-project.output';
import type { IUseCase } from '../use-case.interface';

export const DELETE_PROJECT_USE_CASE = new Injectable<IDeleteProjectUseCase>('IDeleteProjectUseCase');

export interface IDeleteProjectUseCase extends IUseCase<DeleteProjectInput, DeleteProjectOutput> {}
