import { ArchiveProjectUseCase } from '../../../../../src/application/use-cases/projects/archive-project.usecase';
import { IProjectRepository } from '../../../../../src/domain/interfaces/repositories/project-repository.interface';
import { Project } from '../../../../../src/domain/entities/project.entity';
import { EntityNotFoundError } from '../../../../../src/domain/errors/entity-not-found.error';

describe('ArchiveProjectUseCase', () => {
  const makeProjects = (): jest.Mocked<IProjectRepository> => ({
    saveForUser: jest.fn(),
    findByIdForUser: jest.fn(),
    findAllByUser: jest.fn(),
  });

  it('throws EntityNotFoundError when project does not exist', async () => {
    const projects = makeProjects();
    projects.findByIdForUser.mockResolvedValue(null);

    const useCase = new ArchiveProjectUseCase(projects);
    await expect(
      useCase.execute({ userId: 'user-1', projectId: 'missing' }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it('archives and persists a project', async () => {
    const projects = makeProjects();
    const project = Project.create({ id: 'p1', name: 'My Project' });

    projects.findByIdForUser.mockResolvedValue(project);
    projects.saveForUser.mockImplementation((_userId, p) => Promise.resolve(p));

    const useCase = new ArchiveProjectUseCase(projects);
    const result = await useCase.execute({ userId: 'user-1', projectId: 'p1' });

    expect(result.project.status).toBe('ARCHIVED');
  });
});
