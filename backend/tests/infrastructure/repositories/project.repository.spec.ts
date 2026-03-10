import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Project } from '../../../src/domain/entities/project/project.entity';
import { ProjectOrmEntity } from '../../../src/infrastructure/entities/project.orm-entity';
import { TypeOrmProjectRepository } from '../../../src/infrastructure/repositories/type-orm-project.repository';

let dataSource: DataSource;
let repo: TypeOrmProjectRepository;

beforeAll(async () => {
  dataSource = new DataSource({
    type: 'sqljs',
    entities: [ProjectOrmEntity],
    synchronize: true,
    dropSchema: true,
  });
  await dataSource.initialize();
  repo = new TypeOrmProjectRepository(dataSource);
});

afterAll(async () => {
  await dataSource.destroy();
});

beforeEach(async () => {
  await dataSource.getRepository(ProjectOrmEntity).clear();
});

describe('TypeOrmProjectRepository', () => {
  it('saves and retrieves a project by id', async () => {
    const project = Project.create({ title: 'Launch website' });
    await repo.save(project);

    const found = await repo.findById(project.id);
    expect(found).not.toBeNull();
    expect(found!.id).toBe(project.id);
    expect(found!.title).toBe('Launch website');
  });

  it('returns null for unknown id', async () => {
    const found = await repo.findById('non-existent-id');
    expect(found).toBeNull();
  });

  it('findAll returns all saved projects', async () => {
    await repo.save(Project.create({ title: 'Alpha' }));
    await repo.save(Project.create({ title: 'Beta' }));

    const all = await repo.findAll();
    expect(all).toHaveLength(2);
  });

  it('findByTitle is case-insensitive', async () => {
    await repo.save(Project.create({ title: 'My Project' }));

    const found = await repo.findByTitle('my project');
    expect(found).not.toBeNull();
    expect(found!.title).toBe('My Project');

    const notFound = await repo.findByTitle('other');
    expect(notFound).toBeNull();
  });

  it('save updates an existing project', async () => {
    const project = Project.create({ title: 'Old title' });
    await repo.save(project);

    project.rename('New title');
    await repo.save(project);

    const found = await repo.findById(project.id);
    expect(found!.title).toBe('New title');
  });

  it('delete removes the project', async () => {
    const project = Project.create({ title: 'To delete' });
    await repo.save(project);

    await repo.delete(project.id);

    const found = await repo.findById(project.id);
    expect(found).toBeNull();
  });

  it('save returns the project', async () => {
    const project = Project.create({ title: 'Returned' });
    const result = await repo.save(project);
    expect(result.id).toBe(project.id);
    expect(result.title).toBe('Returned');
  });

  describe('findWithQuery', () => {
    it('returns all projects with default pagination', async () => {
      await repo.save(Project.create({ title: 'Alpha' }));
      await repo.save(Project.create({ title: 'Beta' }));

      const result = await repo.findWithQuery({});
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('paginates results', async () => {
      for (let i = 1; i <= 5; i++) {
        await repo.save(Project.create({ title: `Project ${i}` }));
      }

      const page1 = await repo.findWithQuery({ page: 1, limit: 2 });
      expect(page1.items).toHaveLength(2);
      expect(page1.total).toBe(5);

      const page3 = await repo.findWithQuery({ page: 3, limit: 2 });
      expect(page3.items).toHaveLength(1);
    });

    it('sorts by title asc', async () => {
      await repo.save(Project.create({ title: 'Zeta' }));
      await repo.save(Project.create({ title: 'Alpha' }));

      const result = await repo.findWithQuery({ sortBy: 'title', order: 'asc' });
      expect(result.items[0].title).toBe('Alpha');
      expect(result.items[1].title).toBe('Zeta');
    });

    it('sorts by title desc', async () => {
      await repo.save(Project.create({ title: 'Alpha' }));
      await repo.save(Project.create({ title: 'Zeta' }));

      const result = await repo.findWithQuery({ sortBy: 'title', order: 'desc' });
      expect(result.items[0].title).toBe('Zeta');
    });
  });
});
