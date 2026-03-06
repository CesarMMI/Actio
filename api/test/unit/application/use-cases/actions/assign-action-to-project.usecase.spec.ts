import { AssignActionToProjectUseCase } from '../../../../../src/application/use-cases/actions/assign-action-to-project.usecase';
import { IActionRepository } from '../../../../../src/domain/interfaces/repositories/action-repository.interface';
import { IProjectRepository } from '../../../../../src/domain/interfaces/repositories/project-repository.interface';
import { Action } from '../../../../../src/domain/entities/action.entity';
import { Project } from '../../../../../src/domain/entities/project.entity';
import { Title } from '../../../../../src/domain/value-objects/title.value-object';
import { EntityNotFoundError } from '../../../../../src/domain/errors/entity-not-found.error';

describe('AssignActionToProjectUseCase', () => {
  const makeActions = (): jest.Mocked<IActionRepository> => ({
    saveForUser: jest.fn(),
    saveManyForUser: jest.fn(),
    findByIdForUser: jest.fn(),
    findOpenByContext: jest.fn(),
    findByProject: jest.fn(),
  });

  const makeProjects = (): jest.Mocked<IProjectRepository> => ({
    saveForUser: jest.fn(),
    findByIdForUser: jest.fn(),
    findAllByUser: jest.fn(),
  });

  it('throws when action does not exist', async () => {
    const actions = makeActions();
    const projects = makeProjects();
    actions.findByIdForUser.mockResolvedValue(null);

    const useCase = new AssignActionToProjectUseCase(actions, projects);
    await expect(
      useCase.execute({
        userId: 'user-1',
        actionId: 'missing',
        projectId: 'p1',
      }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it('throws when project does not exist', async () => {
    const actions = makeActions();
    const projects = makeProjects();

    const action = Action.create({ id: 'a1', title: Title.create('Do it') });
    actions.findByIdForUser.mockResolvedValue(action);
    projects.findByIdForUser.mockResolvedValue(null);

    const useCase = new AssignActionToProjectUseCase(actions, projects);
    await expect(
      useCase.execute({ userId: 'user-1', actionId: 'a1', projectId: 'p1' }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it('assigns projectId and persists the action', async () => {
    const actions = makeActions();
    const projects = makeProjects();

    const action = Action.create({ id: 'a1', title: Title.create('Do it') });
    actions.findByIdForUser.mockResolvedValue(action);
    projects.findByIdForUser.mockResolvedValue(
      Project.create({ id: 'p1', name: 'Proj' }),
    );
    actions.saveForUser.mockImplementation((_userId, a) => Promise.resolve(a));

    const useCase = new AssignActionToProjectUseCase(actions, projects);
    const result = await useCase.execute({
      userId: 'user-1',
      actionId: 'a1',
      projectId: 'p1',
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(actions.saveForUser).toHaveBeenCalledWith(
      'user-1',
      expect.anything(),
    );
    expect(result.action.projectId).toBe('p1');
  });
});
