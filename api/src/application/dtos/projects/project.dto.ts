import { ProjectStatus } from '../../../domain/enums/project-status';

export type ProjectDto = {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
};
