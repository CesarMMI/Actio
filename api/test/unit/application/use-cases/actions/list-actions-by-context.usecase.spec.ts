import { ListActionsByContextUseCase } from '../../../../../src/application/use-cases/actions/list-actions-by-context.usecase';
import { IActionRepository } from '../../../../../src/domain/interfaces/repositories/action-repository.interface';
import { IContextRepository } from '../../../../../src/domain/interfaces/repositories/context-repository.interface';
import { Context } from '../../../../../src/domain/entities/context.entity';
import { Action } from '../../../../../src/domain/entities/action.entity';
import { Title } from '../../../../../src/domain/value-objects/title.value-object';
import { EntityNotFoundError } from '../../../../../src/domain/errors/entity-not-found.error';

describe('ListActionsByContextUseCase', () => {
  const makeContexts = (): jest.Mocked<IContextRepository> => ({
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

  it('throws EntityNotFoundError when context does not exist', async () => {
    const contexts = makeContexts();
    const actions = makeActions();
    contexts.findByIdForUser.mockResolvedValue(null);

    const useCase = new ListActionsByContextUseCase(contexts, actions);
    await expect(
      useCase.execute({ userId: 'user-1', contextId: 'ctx-1' }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it('returns OPEN actions ordered by due date (nulls last)', async () => {
    const contexts = makeContexts();
    const actionsRepo = makeActions();

    const ctx = Context.create({ id: 'ctx-1', name: 'Home' });
    contexts.findByIdForUser.mockResolvedValue(ctx);

    const a1 = Action.create({
      id: 'a1',
      title: Title.create('First'),
      dueDate: new Date('2026-01-01T00:00:00.000Z'),
    });
    const a2 = Action.create({
      id: 'a2',
      title: Title.create('Second'),
      dueDate: null,
    });
    const a3 = Action.create({
      id: 'a3',
      title: Title.create('Third'),
      dueDate: new Date('2025-12-31T00:00:00.000Z'),
    });

    actionsRepo.findOpenByContext.mockResolvedValue([a1, a2, a3]);

    const useCase = new ListActionsByContextUseCase(contexts, actionsRepo);
    const result = await useCase.execute({
      userId: 'user-1',
      contextId: 'ctx-1',
    });

    expect(result.actions.map((a) => a.id)).toEqual(['a3', 'a1', 'a2']);
  });
});
