import type { Task } from '../../../../domain/entities/task/task.entity';
import type { PaginatedResult } from '../../../../domain/queries/paginated-result';

export type ListTasksOutput = PaginatedResult<Task>;
