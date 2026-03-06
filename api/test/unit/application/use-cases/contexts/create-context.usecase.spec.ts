import { CreateContextUseCase } from '../../../../../src/application/use-cases/contexts/create-context.usecase';
import { IContextRepository } from '../../../../../src/domain/interfaces/repositories/context-repository.interface';
import { IIdGenerator } from '../../../../../src/application/interfaces/services/id-generator.interface';

describe('CreateContextUseCase', () => {
  const makeContexts = (): jest.Mocked<IContextRepository> => ({
    saveForUser: jest.fn(),
    findByIdForUser: jest.fn(),
    findAllByUser: jest.fn(),
  });

  const makeIds = (): jest.Mocked<IIdGenerator> => ({
    newId: jest.fn(),
  });

  it('creates and persists a context', async () => {
    const contexts = makeContexts();
    const ids = makeIds();
    ids.newId.mockReturnValue('c1');
    contexts.saveForUser.mockImplementation((_userId, c) => Promise.resolve(c));

    const useCase = new CreateContextUseCase(contexts, ids);
    const result = await useCase.execute({
      userId: 'user-1',
      name: '  Home  ',
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(contexts.saveForUser).toHaveBeenCalledWith(
      'user-1',
      expect.anything(),
    );
    expect(result.context).toMatchObject({
      id: 'c1',
      name: 'Home',
      active: true,
    });
  });
});
