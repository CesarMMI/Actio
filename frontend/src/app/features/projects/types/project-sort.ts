import { ProjectsRequest } from './project-pagination.api';

export type ProjectSortOption = 'title-asc' | 'title-desc' | 'newest' | 'oldest';

export const PROJECT_SORT_MAP: Record<
  ProjectSortOption,
  { sortBy: ProjectsRequest['sortBy']; order: ProjectsRequest['order'] }
> = {
  'title-asc': { sortBy: 'title', order: 'asc' },
  'title-desc': { sortBy: 'title', order: 'desc' },
  newest: { sortBy: 'createdAt', order: 'desc' },
  oldest: { sortBy: 'createdAt', order: 'asc' },
};
