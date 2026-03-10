import { Injectable } from '../../../di-container/di-container-injectable';
import type { CreateProjectInput } from '../../types/inputs/project/create-project.input';
import type { CreateProjectOutput } from '../../types/outputs/project/create-project.output';
import type { IUseCase } from '../use-case.interface';

export const CREATE_PROJECT_USE_CASE = new Injectable<ICreateProjectUseCase>('ICreateProjectUseCase');

export interface ICreateProjectUseCase extends IUseCase<CreateProjectInput, CreateProjectOutput> {}
