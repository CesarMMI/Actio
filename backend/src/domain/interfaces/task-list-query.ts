export interface TaskListQuery {
  done?: boolean;
  contextId?: string;
  projectId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'description';
  order?: 'asc' | 'desc';
}
