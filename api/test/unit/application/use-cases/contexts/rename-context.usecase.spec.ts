import { RenameContextUseCase } from '../../../../../src/application/use-cases/contexts/rename-context.usecase';
import { IContextRepository } from '../../../../../src/domain/interfaces/repositories/context-repository.interface';
import { Context } from '../../../../../src/domain/entities/context.entity';
import { EntityNotFoundError } from '../../../../../src/domain/errors/entity-not-found.error';

describe('RenameContextUseCase', () => {
  const makeContexts = (): jest.Mocked<IContextRepository> => ({
    saveForUser: jest.fn(),
    findByIdForUser: jest.fn(),
    findAllByUser: jest.fn(),
  });

  it('throws EntityNotFoundError when context does not exist', async () => {
    const contexts = makeContexts();
    contexts.findByIdForUser.mockResolvedValue(null);

    const useCase = new RenameContextUseCase(contexts);
    await expect(
      useCase.execute({ userId: 'user-1', contextId: 'missing', name: 'X' }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it('renames and persists a context', async () => {
    const contexts = makeContexts();
    const ctx = Context.create({ id: 'c1', name: 'Old' });

    contexts.findByIdForUser.mockResolvedValue(ctx);
    contexts.saveForUser.mockImplementation((_userId, c) => Promise.resolve(c));

    const useCase = new RenameContextUseCase(contexts);
    const result = await useCase.execute({
      userId: 'user-1',
      contextId: 'c1',
      name: '  New  ',
    });

    expect(result.context.name).toBe('New');
  });
});
