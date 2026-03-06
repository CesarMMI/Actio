import { Project } from '../../domain/entities/project.entity';
import { ProjectDto } from '../dtos/projects/project.dto';

export function toProjectDto(project: Project): ProjectDto {
  return {
    id: project.id,
    name: project.getName(),
    description: project.description,
    status: project.getStatus(),
  };
}
