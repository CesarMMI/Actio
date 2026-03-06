import { CaptureItemUseCase } from '../../../../../src/application/use-cases/captured-items/capture-item.usecase';
import { ICapturedItemRepository } from '../../../../../src/domain/interfaces/repositories/captured-item-repository.interface';
import { IIdGenerator } from '../../../../../src/application/interfaces/services/id-generator.interface';

describe('CaptureItemUseCase', () => {
  const makeRepo = (): jest.Mocked<ICapturedItemRepository> => ({
    saveForUser: jest.fn(),
    findByIdForUser: jest.fn(),
    findInboxByUser: jest.fn(),
  });

  const makeIds = (): jest.Mocked<IIdGenerator> => ({
    newId: jest.fn(),
  });

  it('creates and persists a captured item', async () => {
    const repo = makeRepo();
    const ids = makeIds();
    ids.newId.mockReturnValue('item-1');

    repo.saveForUser.mockImplementation((_userId, item) =>
      Promise.resolve(item),
    );

    const useCase = new CaptureItemUseCase(repo, ids);
    const result = await useCase.execute({
      userId: 'user-1',
      title: '  Buy milk  ',
      notes: '2%',
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.saveForUser).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.saveForUser).toHaveBeenCalledWith('user-1', expect.anything());

    expect(result).toEqual({
      id: 'item-1',
      title: 'Buy milk',
      notes: '2%',
      status: 'INBOX',
    });
  });

  it('surfaces domain title validation errors', async () => {
    const repo = makeRepo();
    const ids = makeIds();
    ids.newId.mockReturnValue('item-1');

    const useCase = new CaptureItemUseCase(repo, ids);
    await expect(
      useCase.execute({ userId: 'user-1', title: '   ' }),
    ).rejects.toThrow('Title cannot be empty.');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.saveForUser).not.toHaveBeenCalled();
  });
});
