import { TrashCapturedItemUseCase } from '../../../../../src/application/use-cases/captured-items/trash-captured-item.usecase';
import { ICapturedItemRepository } from '../../../../../src/domain/interfaces/repositories/captured-item-repository.interface';
import { CapturedItem } from '../../../../../src/domain/entities/captured-item.entity';
import { Title } from '../../../../../src/domain/value-objects/title.value-object';
import { EntityNotFoundError } from '../../../../../src/domain/errors/entity-not-found.error';

describe('TrashCapturedItemUseCase', () => {
  const makeItems = (): jest.Mocked<ICapturedItemRepository> => ({
    saveForUser: jest.fn(),
    findByIdForUser: jest.fn(),
    findInboxByUser: jest.fn(),
  });

  it('throws EntityNotFoundError when captured item does not exist', async () => {
    const items = makeItems();
    items.findByIdForUser.mockResolvedValue(null);

    const useCase = new TrashCapturedItemUseCase(items);
    await expect(
      useCase.execute({ userId: 'user-1', capturedItemId: 'missing' }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it('moves an INBOX item to TRASH', async () => {
    const items = makeItems();
    const item = CapturedItem.create({
      id: 'item-1',
      title: Title.create('Delete me'),
    });

    items.findByIdForUser.mockResolvedValue(item);
    items.saveForUser.mockImplementation((_userId, it) => Promise.resolve(it));

    const useCase = new TrashCapturedItemUseCase(items);
    const result = await useCase.execute({
      userId: 'user-1',
      capturedItemId: 'item-1',
    });

    expect(result.item.status).toBe('TRASH');
  });
});
