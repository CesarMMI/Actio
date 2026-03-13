import { TasksRequest } from './task-pagination.api';

export type TaskSortOption = 'newest' | 'oldest' | 'az' | 'za' | 'updated';

export const TASK_SORT_MAP: Record<
  TaskSortOption,
  { sortBy: TasksRequest['sortBy']; order: TasksRequest['order'] }
> = {
  newest: { sortBy: 'createdAt', order: 'desc' },
  oldest: { sortBy: 'createdAt', order: 'asc' },
  az: { sortBy: 'description', order: 'asc' },
  za: { sortBy: 'description', order: 'desc' },
  updated: { sortBy: 'updatedAt', order: 'desc' },
};
