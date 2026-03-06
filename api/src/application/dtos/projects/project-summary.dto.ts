import { ProjectStatus } from '../../../domain/enums/project-status';

export type ProjectSummaryDto = {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  openActionCount: number;
};
