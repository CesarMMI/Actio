import { ContextsRequest } from './contexts.api';

export type ContextSortOption = 'title-asc' | 'title-desc' | 'newest' | 'oldest';

export const CONTEXT_SORT_MAP: Record<
  ContextSortOption,
  { sortBy: ContextsRequest['sortBy']; order: ContextsRequest['order'] }
> = {
  'title-asc': { sortBy: 'title', order: 'asc' },
  'title-desc': { sortBy: 'title', order: 'desc' },
  newest: { sortBy: 'createdAt', order: 'desc' },
  oldest: { sortBy: 'createdAt', order: 'asc' },
};
