import type { Context } from '../../../../domain/entities/context/context.entity';
import type { PaginatedResult } from '../../../../domain/queries/paginated-result';

export type ListContextsOutput = PaginatedResult<Context>;
