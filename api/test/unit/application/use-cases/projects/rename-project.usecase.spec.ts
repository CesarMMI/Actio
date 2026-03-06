import { RenameProjectUseCase } from '../../../../../src/application/use-cases/projects/rename-project.usecase';
import { IProjectRepository } from '../../../../../src/domain/interfaces/repositories/project-repository.interface';
import { Project } from '../../../../../src/domain/entities/project.entity';
import { EntityNotFoundError } from '../../../../../src/domain/errors/entity-not-found.error';

describe('RenameProjectUseCase', () => {
  const makeProjects = (): jest.Mocked<IProjectRepository> => ({
    saveForUser: jest.fn(),
    findByIdForUser: jest.fn(),
    findAllByUser: jest.fn(),
  });

  it('throws EntityNotFoundError when project does not exist', async () => {
    const projects = makeProjects();
    projects.findByIdForUser.mockResolvedValue(null);

    const useCase = new RenameProjectUseCase(projects);
    await expect(
      useCase.execute({ userId: 'user-1', projectId: 'missing', name: 'X' }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it('renames and persists a project', async () => {
    const projects = makeProjects();
    const project = Project.create({ id: 'p1', name: 'Old' });

    projects.findByIdForUser.mockResolvedValue(project);
    projects.saveForUser.mockImplementation((_userId, p) => Promise.resolve(p));

    const useCase = new RenameProjectUseCase(projects);
    const result = await useCase.execute({
      userId: 'user-1',
      projectId: 'p1',
      name: '  New  ',
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(projects.saveForUser).toHaveBeenCalledWith(
      'user-1',
      expect.anything(),
    );
    expect(result.project.name).toBe('New');
  });
});
