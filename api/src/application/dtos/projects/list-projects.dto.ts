import { ProjectSummaryDto } from './project-summary.dto';

export type ListProjectsInput = {
  userId: string;
};

export type ListProjectsOutput = {
  projects: ProjectSummaryDto[];
};
