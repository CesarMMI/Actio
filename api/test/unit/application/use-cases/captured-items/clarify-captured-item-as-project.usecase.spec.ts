import { ClarifyCapturedItemAsProjectUseCase } from '../../../../../src/application/use-cases/captured-items/clarify-captured-item-as-project.usecase';
import { IUnitOfWork } from '../../../../../src/application/interfaces/unit-of-work.interface';
import { ICapturedItemRepository } from '../../../../../src/domain/interfaces/repositories/captured-item-repository.interface';
import { IActionRepository } from '../../../../../src/domain/interfaces/repositories/action-repository.interface';
import { IProjectRepository } from '../../../../../src/domain/interfaces/repositories/project-repository.interface';
import { IIdGenerator } from '../../../../../src/application/interfaces/services/id-generator.interface';
import { CapturedItem } from '../../../../../src/domain/entities/captured-item.entity';
import { Title } from '../../../../../src/domain/value-objects/title.value-object';
import { ClarifyItemService } from '../../../../../src/domain/services/clarify-item.service';
import { EntityNotFoundError } from '../../../../../src/domain/errors/entity-not-found.error';

describe('ClarifyCapturedItemAsProjectUseCase', () => {
  const makeUow = (): jest.Mocked<IUnitOfWork> => ({
    runInTransaction: jest.fn((fn) => fn()),
  });

  const makeItems = (): jest.Mocked<ICapturedItemRepository> => ({
    saveForUser: jest.fn(),
    findByIdForUser: jest.fn(),
    findInboxByUser: jest.fn(),
  });

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

  const makeIds = (): jest.Mocked<IIdGenerator> => ({
    newId: jest.fn(),
  });

  it('throws EntityNotFoundError when captured item does not exist', async () => {
    const uow = makeUow();
    const items = makeItems();
    const projects = makeProjects();
    const actions = makeActions();
    const ids = makeIds();

    items.findByIdForUser.mockResolvedValue(null);

    const useCase = new ClarifyCapturedItemAsProjectUseCase(
      uow,
      items,
      projects,
      actions,
      new ClarifyItemService(),
      ids,
    );

    await expect(
      useCase.execute({ userId: 'user-1', capturedItemId: 'missing' }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it('clarifies an INBOX item into a project (optionally with first action) and persists atomically', async () => {
    const uow = makeUow();
    const items = makeItems();
    const projects = makeProjects();
    const actions = makeActions();
    const ids = makeIds();

    ids.newId.mockReturnValueOnce('proj-1').mockReturnValueOnce('action-1');

    const item = CapturedItem.create({
      id: 'item-1',
      title: Title.create('Build feature'),
    });
    items.findByIdForUser.mockResolvedValue(item);
    items.saveForUser.mockImplementation((_userId, it) => Promise.resolve(it));
    projects.saveForUser.mockImplementation((_userId, p) => Promise.resolve(p));
    actions.saveManyForUser.mockImplementation((_userId, as) =>
      Promise.resolve(as),
    );

    const useCase = new ClarifyCapturedItemAsProjectUseCase(
      uow,
      items,
      projects,
      actions,
      new ClarifyItemService(),
      ids,
    );

    const result = await useCase.execute({
      userId: 'user-1',
      capturedItemId: 'item-1',
      projectNameOverride: 'Ship v1',
      createFirstAction: true,
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(uow.runInTransaction).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(items.saveForUser).toHaveBeenCalledWith('user-1', expect.anything());
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(projects.saveForUser).toHaveBeenCalledWith(
      'user-1',
      expect.anything(),
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(actions.saveManyForUser).toHaveBeenCalledWith(
      'user-1',
      expect.any(Array),
    );

    expect(result.item.status).toBe('CLARIFIED_AS_PROJECT');
    expect(result.project).toMatchObject({
      id: 'proj-1',
      name: 'Ship v1',
      status: 'ACTIVE',
    });
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0]).toMatchObject({
      id: 'action-1',
      projectId: 'proj-1',
      status: 'OPEN',
    });
  });
});
