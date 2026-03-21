import { Router } from 'express';
import { Injectable } from '../../di-container/di-container-injectable';

export const CONTROLLERS = new Injectable<IController[]>('IControllers');

export interface IController {
  readonly basePath: string;
  registerRoutes(router: Router): void;
}
