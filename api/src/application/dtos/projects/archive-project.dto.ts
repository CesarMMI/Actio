import { ProjectDto } from './project.dto';

export type ArchiveProjectInput = {
  userId: string;
  projectId: string;
};

export type ArchiveProjectOutput = {
  project: ProjectDto;
};
