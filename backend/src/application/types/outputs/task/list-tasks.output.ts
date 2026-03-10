import type { Task } from '../../../../domain/entities/task/task.entity';
import type { PaginatedResult } from '../../../../domain/interfaces/paginated-result';

export type ListTasksOutput = PaginatedResult<Task>;
