import type { Project } from '../../../../domain/entities/project/project.entity';
import type { PaginatedResult } from '../../../../domain/interfaces/paginated-result';

export type ListProjectsOutput = PaginatedResult<Project>;
