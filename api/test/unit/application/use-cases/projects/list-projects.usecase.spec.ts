import { ListProjectsUseCase } from '../../../../../src/application/use-cases/projects/list-projects.usecase';
import { IActionRepository } from '../../../../../src/domain/interfaces/repositories/action-repository.interface';
import { IProjectRepository } from '../../../../../src/domain/interfaces/repositories/project-repository.interface';
import { Project } from '../../../../../src/domain/entities/project.entity';
import { Action } from '../../../../../src/domain/entities/action.entity';
import { Title } from '../../../../../src/domain/value-objects/title.value-object';

describe('ListProjectsUseCase', () => {
  const makeProjects = (): jest.Mocked<IProjectRepository> => ({
    saveForUser: jest.fn(),
    findByIdForUser: jest.fn(),
    findAllByUser: jest.fn(),
  });

  const makeActions = (): jest.Mocked<IActionRepository> => ({
    saveForUser: jest.fn(),
    saveManyForUser: jest.fn(),
    findByIdForUser: jest.fn(),
    findOpenByContext: jest.fn(),
    findByProject: jest.fn(),
  });

  it('returns projects with open action counts', async () => {
    const projects = makeProjects();
    const actions = makeActions();

    const p1 = Project.create({ id: 'p1', name: 'P1' });
    const p2 = Project.create({ id: 'p2', name: 'P2' });
    projects.findAllByUser.mockResolvedValue([p1, p2]);

    const a1 = Action.create({ id: 'a1', title: Title.create('A1') });
    const a2 = Action.create({ id: 'a2', title: Title.create('A2') });
    a2.complete();

    actions.findByProject.mockImplementation((_userId, projectId) =>
      Promise.resolve(projectId === 'p1' ? [a1, a2] : []),
    );

    const useCase = new ListProjectsUseCase(projects, actions);
    const result = await useCase.execute({ userId: 'user-1' });

    expect(result.projects).toEqual([
      {
        id: 'p1',
        name: 'P1',
        description: undefined,
        status: 'ACTIVE',
        openActionCount: 1,
      },
      {
        id: 'p2',
        name: 'P2',
        description: undefined,
        status: 'ACTIVE',
        openActionCount: 0,
      },
    ]);
  });
});
