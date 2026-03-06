import { Context } from '../../../../../src/domain/entities/context.entity';
import { TypeOrmContextRepository } from '../../../../../src/infrastructure/persistence/repositories/typeorm-context.repository';

describe('TypeOrmContextRepository (Unit)', () => {
  let repository: TypeOrmContextRepository;
  let mockTypeOrmRepo: any;

  beforeEach(() => {
    mockTypeOrmRepo = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };
    repository = new TypeOrmContextRepository(mockTypeOrmRepo);
  });

  const mockContextOrm = {
    id: 'ctx1',
    userId: 'usr1',
    name: 'Errands',
    description: null,
    active: true,
  };

  it('should save a context', async () => {
    const context = Context.create({ id: 'ctx1', name: 'Errands' });
    mockTypeOrmRepo.save.mockResolvedValue(mockContextOrm);

    const result = await repository.saveForUser('usr1', context);

    expect(mockTypeOrmRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'ctx1', userId: 'usr1' }),
    );
    expect(result.id).toBe('ctx1');
  });

  it('should find by id for user', async () => {
    mockTypeOrmRepo.findOne.mockResolvedValue(mockContextOrm);

    const result = await repository.findByIdForUser('usr1', 'ctx1');

    expect(mockTypeOrmRepo.findOne).toHaveBeenCalledWith({
      where: { userId: 'usr1', id: 'ctx1' },
    });
    expect(result?.id).toBe('ctx1');
  });

  it('should find all by user', async () => {
    mockTypeOrmRepo.find.mockResolvedValue([mockContextOrm]);

    const result = await repository.findAllByUser('usr1', { limit: 5 });

    expect(mockTypeOrmRepo.find).toHaveBeenCalledWith({
      where: { userId: 'usr1' },
      take: 5,
      skip: undefined,
    });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('ctx1');
  });
});
