import { AssignActionToContextUseCase } from '../../../../../src/application/use-cases/actions/assign-action-to-context.usecase';
import { IActionRepository } from '../../../../../src/domain/interfaces/repositories/action-repository.interface';
import { IContextRepository } from '../../../../../src/domain/interfaces/repositories/context-repository.interface';
import { Action } from '../../../../../src/domain/entities/action.entity';
import { Context } from '../../../../../src/domain/entities/context.entity';
import { Title } from '../../../../../src/domain/value-objects/title.value-object';
import { EntityNotFoundError } from '../../../../../src/domain/errors/entity-not-found.error';

describe('AssignActionToContextUseCase', () => {
  const makeActions = (): jest.Mocked<IActionRepository> => ({
    saveForUser: jest.fn(),
    saveManyForUser: jest.fn(),
    findByIdForUser: jest.fn(),
    findOpenByContext: jest.fn(),
    findByProject: jest.fn(),
  });

  const makeContexts = (): jest.Mocked<IContextRepository> => ({
    saveForUser: jest.fn(),
    findByIdForUser: jest.fn(),
    findAllByUser: jest.fn(),
  });

  it('throws when action does not exist', async () => {
    const actions = makeActions();
    const contexts = makeContexts();
    actions.findByIdForUser.mockResolvedValue(null);

    const useCase = new AssignActionToContextUseCase(actions, contexts);
    await expect(
      useCase.execute({
        userId: 'user-1',
        actionId: 'missing',
        contextId: 'c1',
      }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it('throws when context does not exist', async () => {
    const actions = makeActions();
    const contexts = makeContexts();

    const action = Action.create({ id: 'a1', title: Title.create('Do it') });
    actions.findByIdForUser.mockResolvedValue(action);
    contexts.findByIdForUser.mockResolvedValue(null);

    const useCase = new AssignActionToContextUseCase(actions, contexts);
    await expect(
      useCase.execute({ userId: 'user-1', actionId: 'a1', contextId: 'c1' }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it('assigns contextId and persists the action', async () => {
    const actions = makeActions();
    const contexts = makeContexts();

    const action = Action.create({ id: 'a1', title: Title.create('Do it') });
    actions.findByIdForUser.mockResolvedValue(action);
    contexts.findByIdForUser.mockResolvedValue(
      Context.create({ id: 'c1', name: 'Home' }),
    );
    actions.saveForUser.mockImplementation((_userId, a) => Promise.resolve(a));

    const useCase = new AssignActionToContextUseCase(actions, contexts);
    const result = await useCase.execute({
      userId: 'user-1',
      actionId: 'a1',
      contextId: 'c1',
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(actions.saveForUser).toHaveBeenCalledWith(
      'user-1',
      expect.anything(),
    );
    expect(result.action.contextId).toBe('c1');
  });
});
