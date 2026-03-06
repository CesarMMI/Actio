import { ProjectDto } from './project.dto';

export type CreateProjectInput = {
  userId: string;
  name: string;
  description?: string;
};

export type CreateProjectOutput = {
  project: ProjectDto;
};
