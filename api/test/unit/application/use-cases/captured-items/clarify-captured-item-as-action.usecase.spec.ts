import { ClarifyCapturedItemAsActionUseCase } from '../../../../../src/application/use-cases/captured-items/clarify-captured-item-as-action.usecase';
import { IUnitOfWork } from '../../../../../src/application/interfaces/unit-of-work.interface';
import { ICapturedItemRepository } from '../../../../../src/domain/interfaces/repositories/captured-item-repository.interface';
import { IActionRepository } from '../../../../../src/domain/interfaces/repositories/action-repository.interface';
import { IIdGenerator } from '../../../../../src/application/interfaces/services/id-generator.interface';
import { CapturedItem } from '../../../../../src/domain/entities/captured-item.entity';
import { Title } from '../../../../../src/domain/value-objects/title.value-object';
import { ClarifyItemService } from '../../../../../src/domain/services/clarify-item.service';
import { EntityNotFoundError } from '../../../../../src/domain/errors/entity-not-found.error';

describe('ClarifyCapturedItemAsActionUseCase', () => {
  const makeUow = (): jest.Mocked<IUnitOfWork> => ({
    runInTransaction: jest.fn((fn) => fn()),
  });

  const makeItems = (): jest.Mocked<ICapturedItemRepository> => ({
    saveForUser: jest.fn(),
    findByIdForUser: jest.fn(),
    findInboxByUser: jest.fn(),
  });

  const makeActions = (): jest.Mocked<IActionRepository> => ({
    saveForUser: jest.fn(),
    saveManyForUser: jest.fn(),
    findByIdForUser: jest.fn(),
    findOpenByContext: jest.fn(),
    findByProject: jest.fn(),
  });

  const makeIds = (): jest.Mocked<IIdGenerator> => ({
    newId: jest.fn(),
  });

  it('throws EntityNotFoundError when captured item does not exist', async () => {
    const uow = makeUow();
    const items = makeItems();
    const actions = makeActions();
    const ids = makeIds();

    items.findByIdForUser.mockResolvedValue(null);

    const useCase = new ClarifyCapturedItemAsActionUseCase(
      uow,
      items,
      actions,
      new ClarifyItemService(),
      ids,
    );
    await expect(
      useCase.execute({
        userId: 'user-1',
        capturedItemId: 'missing',
        contextId: 'ctx-1',
      }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it('clarifies an INBOX item into an action and persists both atomically', async () => {
    const uow = makeUow();
    const items = makeItems();
    const actions = makeActions();
    const ids = makeIds();

    ids.newId.mockReturnValue('action-1');

    const item = CapturedItem.create({
      id: 'item-1',
      title: Title.create('Do thing'),
    });
    items.findByIdForUser.mockResolvedValue(item);
    items.saveForUser.mockImplementation((_userId, it) => Promise.resolve(it));
    actions.saveManyForUser.mockImplementation((_userId, as) =>
      Promise.resolve(as),
    );

    const useCase = new ClarifyCapturedItemAsActionUseCase(
      uow,
      items,
      actions,
      new ClarifyItemService(),
      ids,
    );
    const result = await useCase.execute({
      userId: 'user-1',
      capturedItemId: 'item-1',
      projectId: 'proj-1',
      contextId: 'ctx-1',
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(uow.runInTransaction).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(items.saveForUser).toHaveBeenCalledWith('user-1', expect.anything());
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(actions.saveManyForUser).toHaveBeenCalledWith(
      'user-1',
      expect.any(Array),
    );

    expect(result.item.status).toBe('CLARIFIED_AS_ACTION');
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0]).toMatchObject({
      id: 'action-1',
      title: 'Do thing',
      projectId: 'proj-1',
      contextId: 'ctx-1',
      status: 'OPEN',
    });
  });
});
