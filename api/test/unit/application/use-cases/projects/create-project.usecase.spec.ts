import { CreateProjectUseCase } from '../../../../../src/application/use-cases/projects/create-project.usecase';
import { IProjectRepository } from '../../../../../src/domain/interfaces/repositories/project-repository.interface';
import { IIdGenerator } from '../../../../../src/application/interfaces/services/id-generator.interface';

describe('CreateProjectUseCase', () => {
  const makeProjects = (): jest.Mocked<IProjectRepository> => ({
    saveForUser: jest.fn(),
    findByIdForUser: jest.fn(),
    findAllByUser: jest.fn(),
  });

  const makeIds = (): jest.Mocked<IIdGenerator> => ({
    newId: jest.fn(),
  });

  it('creates and persists a project', async () => {
    const projects = makeProjects();
    const ids = makeIds();
    ids.newId.mockReturnValue('p1');
    projects.saveForUser.mockImplementation((_userId, p) => Promise.resolve(p));

    const useCase = new CreateProjectUseCase(projects, ids);
    const result = await useCase.execute({
      userId: 'user-1',
      name: '  My Project  ',
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(projects.saveForUser).toHaveBeenCalledWith(
      'user-1',
      expect.anything(),
    );
    expect(result.project).toMatchObject({
      id: 'p1',
      name: 'My Project',
      status: 'ACTIVE',
    });
  });
});
