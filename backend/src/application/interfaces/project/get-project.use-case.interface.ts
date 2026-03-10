import { Injectable } from '../../../di-container/di-container-injectable';
import type { GetProjectInput } from '../../types/inputs/project/get-project.input';
import type { GetProjectOutput } from '../../types/outputs/project/get-project.output';
import type { IUseCase } from '../use-case.interface';

export const GET_PROJECT_USE_CASE = new Injectable<IGetProjectUseCase>('IGetProjectUseCase');

export interface IGetProjectUseCase extends IUseCase<GetProjectInput, GetProjectOutput> {}
