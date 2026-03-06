import { EnergyLevel } from '../../../../../src/domain/value-objects/energy-level.value-object';
import { TimeBucket } from '../../../../../src/domain/value-objects/time-bucket.value-object';
import { Action } from '../../../../../src/domain/entities/action.entity';
import { Title } from '../../../../../src/domain/value-objects/title.value-object';
import { TypeOrmActionRepository } from '../../../../../src/infrastructure/persistence/repositories/typeorm-action.repository';

describe('TypeOrmActionRepository (Unit)', () => {
  let repository: TypeOrmActionRepository;
  let mockTypeOrmRepo: any;
  let mockQueryBuilder: any;

  beforeEach(() => {
    mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    };

    mockTypeOrmRepo = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };
    repository = new TypeOrmActionRepository(mockTypeOrmRepo);
  });

  const mockActionOrm = {
    id: 'act1',
    userId: 'usr1',
    title: 'Write report',
    notes: null,
    dueDate: null,
    timeBucket: null,
    energyLevel: null,
    projectId: null,
    contextId: null,
    status: 'OPEN',
    completedAt: null,
  };

  it('should save a single action', async () => {
    const action = Action.create({
      id: 'act1',
      title: Title.create('Write report'),
    });
    mockTypeOrmRepo.save.mockResolvedValue(mockActionOrm);

    const result = await repository.saveForUser('usr1', action);

    expect(mockTypeOrmRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'act1', userId: 'usr1' }),
    );
    expect(result.id).toBe('act1');
  });

  it('should save multiple actions', async () => {
    const action = Action.create({
      id: 'act1',
      title: Title.create('Write report'),
    });
    mockTypeOrmRepo.save.mockResolvedValue([mockActionOrm]);

    const result = await repository.saveManyForUser('usr1', [action]);

    expect(mockTypeOrmRepo.save).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: 'act1' })]),
    );
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('act1');
  });

  it('should find by id for user', async () => {
    mockTypeOrmRepo.findOne.mockResolvedValue(mockActionOrm);

    const result = await repository.findByIdForUser('usr1', 'act1');

    expect(mockTypeOrmRepo.findOne).toHaveBeenCalledWith({
      where: { userId: 'usr1', id: 'act1' },
    });
    expect(result?.id).toBe('act1');
  });

  it('should find by project', async () => {
    mockTypeOrmRepo.find.mockResolvedValue([mockActionOrm]);

    const result = await repository.findByProject('usr1', 'prj1');

    expect(mockTypeOrmRepo.find).toHaveBeenCalledWith({
      where: { userId: 'usr1', projectId: 'prj1' },
    });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('act1');
  });

  it('should find open by context with filters directly applied to query builder', async () => {
    mockQueryBuilder.getMany.mockResolvedValue([mockActionOrm]);

    const result = await repository.findOpenByContext('usr1', 'ctx1', {
      timeBucket: TimeBucket.create('short'),
      energyLevel: EnergyLevel.create('low'),
    });

    expect(mockTypeOrmRepo.createQueryBuilder).toHaveBeenCalledWith('action');
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      'action.userId = :userId',
      { userId: 'usr1' },
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'action.contextId = :contextId',
      { contextId: 'ctx1' },
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'action.status = :status',
      { status: 'OPEN' },
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'action.timeBucket = :timeBucket',
      { timeBucket: 'short' },
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'action.energyLevel = :energyLevel',
      { energyLevel: 'low' },
    );
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
      'action.dueDate',
      'ASC',
      'NULLS LAST',
    );

    expect(result.length).toBe(1);
    expect(result[0].id).toBe('act1');
  });
});
