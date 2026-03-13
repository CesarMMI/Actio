import { PaginationRequest } from '../../../shared/pagination/types/pagination.api';

export type TasksRequest = Omit<PaginationRequest, 'sortBy'> & {
  sortBy?: 'createdAt' | 'updatedAt' | 'description';
  done?: boolean;
  contextId?: string;
  projectId?: string;
};
