import { User } from '../../../../../src/domain/entities/user.entity';
import { TypeOrmUserRepository } from '../../../../../src/infrastructure/persistence/repositories/typeorm-user.repository';

describe('TypeOrmUserRepository (Unit)', () => {
  let repository: TypeOrmUserRepository;
  let mockTypeOrmRepo: any;

  beforeEach(() => {
    mockTypeOrmRepo = {
      save: jest.fn(),
      findOne: jest.fn(),
    };
    repository = new TypeOrmUserRepository(mockTypeOrmRepo);
  });

  it('should save a user', async () => {
    const user = User.create({
      id: 'usr1',
      email: 'test@example.com',
      passwordHash: 'hashed_password_123',
    });

    mockTypeOrmRepo.save.mockResolvedValue({
      id: 'usr1',
      email: 'test@example.com',
      passwordHash: 'hashed_password_123',
    });

    const result = await repository.save(user);

    expect(mockTypeOrmRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'usr1' }),
    );
    expect(result).toBeInstanceOf(User);
    expect(result.id).toBe('usr1');
  });

  it('should find by id', async () => {
    mockTypeOrmRepo.findOne.mockResolvedValue({
      id: 'usr1',
      email: 'test@example.com',
      passwordHash: 'hashed_password_123',
    });

    const result = await repository.findById('usr1');

    expect(mockTypeOrmRepo.findOne).toHaveBeenCalledWith({
      where: { id: 'usr1' },
    });
    expect(result).toBeInstanceOf(User);
    expect(result?.id).toBe('usr1');
  });

  it('should find by email', async () => {
    mockTypeOrmRepo.findOne.mockResolvedValue({
      id: 'usr1',
      email: 'test@example.com',
      passwordHash: 'hashed_password_123',
    });

    const result = await repository.findByEmail('test@example.com');

    expect(mockTypeOrmRepo.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(result?.email).toBe('test@example.com');
  });

  it('should return null when not found', async () => {
    mockTypeOrmRepo.findOne.mockResolvedValue(null);
    expect(await repository.findById('usr1')).toBeNull();
  });
});
