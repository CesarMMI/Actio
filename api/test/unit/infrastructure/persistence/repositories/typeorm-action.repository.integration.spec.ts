import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Action } from '../../../../../src/domain/entities/action.entity';
import { EnergyLevel } from '../../../../../src/domain/value-objects/energy-level.value-object';
import { TimeBucket } from '../../../../../src/domain/value-objects/time-bucket.value-object';
import { Title } from '../../../../../src/domain/value-objects/title.value-object';
import { ActionOrmEntity } from '../../../../../src/infrastructure/persistence/orm-entities/action.orm-entity';
import { ContextOrmEntity } from '../../../../../src/infrastructure/persistence/orm-entities/context.orm-entity';
import { ProjectOrmEntity } from '../../../../../src/infrastructure/persistence/orm-entities/project.orm-entity';
import { UserOrmEntity } from '../../../../../src/infrastructure/persistence/orm-entities/user.orm-entity';
import { TypeOrmActionRepository } from '../../../../../src/infrastructure/persistence/repositories/typeorm-action.repository';

describe('TypeOrmActionRepository (Integration)', () => {
  let module: TestingModule;
  let repository: TypeOrmActionRepository;
  let userRepo: Repository<UserOrmEntity>;
  let contextRepo: Repository<ContextOrmEntity>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [
            UserOrmEntity,
            ProjectOrmEntity,
            ContextOrmEntity,
            ActionOrmEntity,
          ],
          synchronize: true, // auto-create tables
        }),
        TypeOrmModule.forFeature([
          UserOrmEntity,
          ProjectOrmEntity,
          ContextOrmEntity,
          ActionOrmEntity,
        ]),
      ],
      providers: [TypeOrmActionRepository],
    }).compile();

    repository = module.get<TypeOrmActionRepository>(TypeOrmActionRepository);
    userRepo = module.get('UserOrmEntityRepository');
    contextRepo = module.get('ContextOrmEntityRepository');

    // Create user and context for foreign keys
    await userRepo.save({
      id: 'usr1',
      email: 'test@example.com',
      passwordHash: 'hash',
    });

    await contextRepo.save({
      id: 'ctx1',
      userId: 'usr1',
      name: 'Errands',
      active: true,
    });
  });

  afterAll(async () => {
    await module.close();
  });

  it('should save and find open actions by context with filters', async () => {
    const action1 = Action.create({
      id: 'act1',
      title: Title.create('Buy milk'),
      timeBucket: TimeBucket.create('medium'),
      energyLevel: EnergyLevel.create('low'),
      contextId: 'ctx1',
    });

    const action2 = Action.create({
      id: 'act2',
      title: Title.create('Buy eggs'),
      timeBucket: TimeBucket.create('medium'),
      energyLevel: EnergyLevel.create('high'), // Different energy
      contextId: 'ctx1',
    });

    const action3 = Action.create({
      id: 'act3',
      title: Title.create('Completed task'),
      timeBucket: TimeBucket.create('medium'),
      energyLevel: EnergyLevel.create('low'),
      contextId: 'ctx1',
    });
    action3.complete(); // Not OPEN

    await repository.saveManyForUser('usr1', [action1, action2, action3]);

    // Query 1: Find all open in context
    const allOpen = await repository.findOpenByContext('usr1', 'ctx1');
    expect(allOpen).toHaveLength(2);
    expect(allOpen.map((a) => a.id).sort()).toEqual(['act1', 'act2']);

    // Query 2: Filter by energy level
    const lowEnergy = await repository.findOpenByContext('usr1', 'ctx1', {
      energyLevel: EnergyLevel.create('low'),
    });
    expect(lowEnergy).toHaveLength(1);
    expect(lowEnergy[0].id).toBe('act1');

    // Query 3: Filter by time bucket
    const mediumTime = await repository.findOpenByContext('usr1', 'ctx1', {
      timeBucket: TimeBucket.create('medium'),
    });
    expect(mediumTime).toHaveLength(2);
  });
});
