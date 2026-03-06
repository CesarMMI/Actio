import { CompleteActionUseCase } from '../../../../../src/application/use-cases/actions/complete-action.usecase';
import { IActionRepository } from '../../../../../src/domain/interfaces/repositories/action-repository.interface';
import { Action } from '../../../../../src/domain/entities/action.entity';
import { Title } from '../../../../../src/domain/value-objects/title.value-object';
import { EntityNotFoundError } from '../../../../../src/domain/errors/entity-not-found.error';

describe('CompleteActionUseCase', () => {
  const makeActions = (): jest.Mocked<IActionRepository> => ({
    saveForUser: jest.fn(),
    saveManyForUser: jest.fn(),
    findByIdForUser: jest.fn(),
    findOpenByContext: jest.fn(),
    findByProject: jest.fn(),
  });

  it('throws EntityNotFoundError when action does not exist', async () => {
    const actions = makeActions();
    actions.findByIdForUser.mockResolvedValue(null);

    const useCase = new CompleteActionUseCase(actions);
    await expect(
      useCase.execute({ userId: 'user-1', actionId: 'missing' }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it('completes an OPEN action and persists it', async () => {
    const actions = makeActions();
    const action = Action.create({ id: 'a1', title: Title.create('Do it') });

    actions.findByIdForUser.mockResolvedValue(action);
    actions.saveForUser.mockImplementation((_userId, a) => Promise.resolve(a));

    const useCase = new CompleteActionUseCase(actions);
    const result = await useCase.execute({ userId: 'user-1', actionId: 'a1' });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(actions.saveForUser).toHaveBeenCalledWith(
      'user-1',
      expect.anything(),
    );
    expect(result.action.status).toBe('COMPLETED');
  });
});
