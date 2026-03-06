import { ProjectDto } from './project.dto';

export type RenameProjectInput = {
  userId: string;
  projectId: string;
  name: string;
};

export type RenameProjectOutput = {
  project: ProjectDto;
};
