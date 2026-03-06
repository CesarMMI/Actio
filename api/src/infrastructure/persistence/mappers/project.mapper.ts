import { Project } from '../../../domain/entities/project.entity';
import { ProjectOrmEntity } from '../orm-entities/project.orm-entity';
import { ProjectStatus } from '../../../domain/enums/project-status';

export function toDomain(orm: ProjectOrmEntity): Project {
  const project = Project.create({
    id: orm.id,
    name: orm.name,
    description: orm.description || undefined,
  });

  project['status'] = orm.status as ProjectStatus;

  return project;
}

export function toPersistence(
  domain: Project,
  userId: string,
): ProjectOrmEntity {
  const orm = new ProjectOrmEntity();
  orm.id = domain.id;
  orm.userId = userId;
  orm.name = domain.getName();
  orm.description = domain.description || null;
  orm.status = domain.getStatus();
  return orm;
}
