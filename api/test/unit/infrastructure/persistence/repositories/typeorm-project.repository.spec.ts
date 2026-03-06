import { Project } from '../../../../../src/domain/entities/project.entity';
import { TypeOrmProjectRepository } from '../../../../../src/infrastructure/persistence/repositories/typeorm-project.repository';

describe('TypeOrmProjectRepository (Unit)', () => {
  let repository: TypeOrmProjectRepository;
  let mockTypeOrmRepo: any;

  beforeEach(() => {
    mockTypeOrmRepo = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };
    repository = new TypeOrmProjectRepository(mockTypeOrmRepo);
  });

  const mockProjectOrm = {
    id: 'prj1',
    userId: 'usr1',
    name: 'Home Renovation',
    description: null,
    status: 'ACTIVE',
  };

  it('should save a project', async () => {
    const project = Project.create({ id: 'prj1', name: 'Home Renovation' });
    mockTypeOrmRepo.save.mockResolvedValue(mockProjectOrm);

    const result = await repository.saveForUser('usr1', project);

    expect(mockTypeOrmRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'prj1', userId: 'usr1' }),
    );
    expect(result.id).toBe('prj1');
  });

  it('should find by id for user', async () => {
    mockTypeOrmRepo.findOne.mockResolvedValue(mockProjectOrm);

    const result = await repository.findByIdForUser('usr1', 'prj1');

    expect(mockTypeOrmRepo.findOne).toHaveBeenCalledWith({
      where: { userId: 'usr1', id: 'prj1' },
    });
    expect(result?.id).toBe('prj1');
  });

  it('should find all by user', async () => {
    mockTypeOrmRepo.find.mockResolvedValue([mockProjectOrm]);

    const result = await repository.findAllByUser('usr1', { limit: 5 });

    expect(mockTypeOrmRepo.find).toHaveBeenCalledWith({
      where: { userId: 'usr1' },
      take: 5,
      skip: undefined,
    });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('prj1');
  });
});
