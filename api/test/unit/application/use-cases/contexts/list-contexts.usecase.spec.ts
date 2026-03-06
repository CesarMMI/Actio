import { ListContextsUseCase } from '../../../../../src/application/use-cases/contexts/list-contexts.usecase';
import { IContextRepository } from '../../../../../src/domain/interfaces/repositories/context-repository.interface';
import { Context } from '../../../../../src/domain/entities/context.entity';

describe('ListContextsUseCase', () => {
  const makeContexts = (): jest.Mocked<IContextRepository> => ({
    saveForUser: jest.fn(),
    findByIdForUser: jest.fn(),
    findAllByUser: jest.fn(),
  });

  it('lists contexts for a user', async () => {
    const contexts = makeContexts();
    contexts.findAllByUser.mockResolvedValue([
      Context.create({ id: 'c1', name: 'Home' }),
      Context.create({ id: 'c2', name: 'Work' }),
    ]);

    const useCase = new ListContextsUseCase(contexts);
    const result = await useCase.execute({ userId: 'user-1' });

    expect(result.contexts.map((c) => c.id)).toEqual(['c1', 'c2']);
  });
});
