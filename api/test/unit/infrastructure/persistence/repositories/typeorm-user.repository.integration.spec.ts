import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmUserRepository } from '../../../../../src/infrastructure/persistence/repositories/typeorm-user.repository';
import { UserOrmEntity } from '../../../../../src/infrastructure/persistence/orm-entities/user.orm-entity';
import { User } from '../../../../../src/domain/entities/user.entity';

describe('TypeOrmUserRepository (Integration)', () => {
  let module: TestingModule;
  let repository: TypeOrmUserRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [UserOrmEntity],
          synchronize: true, // auto-create tables
        }),
        TypeOrmModule.forFeature([UserOrmEntity]),
      ],
      providers: [TypeOrmUserRepository],
    }).compile();

    repository = module.get<TypeOrmUserRepository>(TypeOrmUserRepository);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should save a user and retrieve it by id and email', async () => {
    const user = User.create({
      id: 'usr-int-1',
      email: 'integration@example.com',
      passwordHash: 'hashed_password_123',
    });

    // 1. Save user
    const savedUser = await repository.save(user);
    expect(savedUser.id).toBe('usr-int-1');

    // 2. Find by id
    const foundById = await repository.findById('usr-int-1');
    expect(foundById).not.toBeNull();
    expect(foundById?.email).toBe('integration@example.com');

    // 3. Find by email
    const foundByEmail = await repository.findByEmail(
      'integration@example.com',
    );
    expect(foundByEmail).not.toBeNull();
    expect(foundByEmail?.id).toBe('usr-int-1');
  });

  it('should return null for non-existent users', async () => {
    expect(await repository.findById('nonexistent')).toBeNull();
    expect(await repository.findByEmail('nope@example.com')).toBeNull();
  });

  it('should fail on duplicate email', async () => {
    const user1 = User.create({
      id: 'usr-int-2',
      email: 'duplicate@example.com',
      passwordHash: 'hashed_password_123',
    });

    const user2 = User.create({
      id: 'usr-int-3',
      email: 'duplicate@example.com',
      passwordHash: 'hashed_password_456',
    });

    await repository.save(user1);

    await expect(repository.save(user2)).rejects.toThrow(); // SQLite constraint violation
  });
});
