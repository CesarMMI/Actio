import type { Context } from '../../../../domain/entities/context/context.entity';
import type { PaginatedResult } from '../../../../domain/interfaces/paginated-result';

export type ListContextsOutput = PaginatedResult<Context>;
