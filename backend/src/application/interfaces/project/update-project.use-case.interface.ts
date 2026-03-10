import { Injectable } from '../../../di-container/di-container-injectable';
import type { UpdateProjectInput } from '../../types/inputs/project/update-project.input';
import type { UpdateProjectOutput } from '../../types/outputs/project/update-project.output';
import type { IUseCase } from '../use-case.interface';

export const UPDATE_PROJECT_USE_CASE = new Injectable<IUpdateProjectUseCase>('IUpdateProjectUseCase');

export interface IUpdateProjectUseCase extends IUseCase<UpdateProjectInput, UpdateProjectOutput> {}
