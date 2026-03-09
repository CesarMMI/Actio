import { Action } from '../../../domain/entities/action';
import { ActionFilters } from '../../../domain/interfaces';

export interface IViewActionsUseCase {
  execute(filters?: ActionFilters): Promise<Action[]>;
}
