import { CapturedItem } from '../../../../../src/domain/entities/captured-item.entity';
import { Title } from '../../../../../src/domain/value-objects/title.value-object';
import { TypeOrmCapturedItemRepository } from '../../../../../src/infrastructure/persistence/repositories/typeorm-captured-item.repository';

describe('TypeOrmCapturedItemRepository (Unit)', () => {
  let repository: TypeOrmCapturedItemRepository;
  let mockTypeOrmRepo: any;

  beforeEach(() => {
    mockTypeOrmRepo = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };
    repository = new TypeOrmCapturedItemRepository(mockTypeOrmRepo);
  });

  const mockItemOrm = {
    id: 'cmd1',
    userId: 'usr1',
    title: 'Buy milk',
    notes: '2% milk',
    status: 'INBOX',
  };

  it('should save an item', async () => {
    const item = CapturedItem.create({
      id: 'cmd1',
      title: Title.create('Buy milk'),
      notes: '2% milk',
    });

    mockTypeOrmRepo.save.mockResolvedValue(mockItemOrm);

    const result = await repository.saveForUser('usr1', item);

    expect(mockTypeOrmRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'cmd1', userId: 'usr1' }),
    );
    expect(result).toBeInstanceOf(CapturedItem);
    expect(result.id).toBe('cmd1');
  });

  it('should find by id for user', async () => {
    mockTypeOrmRepo.findOne.mockResolvedValue(mockItemOrm);

    const result = await repository.findByIdForUser('usr1', 'cmd1');

    expect(mockTypeOrmRepo.findOne).toHaveBeenCalledWith({
      where: { id: 'cmd1', userId: 'usr1' },
    });
    expect(result).toBeInstanceOf(CapturedItem);
    expect(result?.id).toBe('cmd1');
  });

  it('should return null when finding by id fails for user', async () => {
    mockTypeOrmRepo.findOne.mockResolvedValue(null);
    expect(await repository.findByIdForUser('usr1', 'cmd1')).toBeNull();
  });

  it('should find inbox items for user', async () => {
    mockTypeOrmRepo.find.mockResolvedValue([mockItemOrm]);

    const result = await repository.findInboxByUser('usr1', {
      limit: 10,
      offset: 0,
    });

    expect(mockTypeOrmRepo.find).toHaveBeenCalledWith({
      where: { userId: 'usr1', status: 'INBOX' },
      take: 10,
      skip: 0,
    });
    expect(result.length).toBe(1);
    expect(result[0]).toBeInstanceOf(CapturedItem);
  });
});
