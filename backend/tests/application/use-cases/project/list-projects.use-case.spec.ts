import { ListProjectsUseCase } from '../../../../src/application/use-cases/project/list-projects.use-case';
import { Project } from '../../../../src/domain/entities/project/project.entity';
import { InMemoryProjectRepository } from '../../mocks/in-memory-project.repository';

describe('UC-P03 — List Projects', () => {
  let useCase: ListProjectsUseCase;
  let projectRepo: InMemoryProjectRepository;

  beforeEach(() => {
    projectRepo = new InMemoryProjectRepository();
    useCase = new ListProjectsUseCase(projectRepo);
  });

  it('returns paginated result with zero items when no projects exist', async () => {
    const result = await useCase.execute({});
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it('returns all projects with pagination metadata', async () => {
    await projectRepo.save(Project.create({ title: 'Project A' }));
    await projectRepo.save(Project.create({ title: 'Project B' }));
    const result = await useCase.execute({});
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
  });

  it('paginates results', async () => {
    for (let i = 1; i <= 5; i++) {
      await projectRepo.save(Project.create({ title: `Project ${i}` }));
    }

    const page1 = await useCase.execute({ page: 1, limit: 2 });
    expect(page1.items).toHaveLength(2);
    expect(page1.total).toBe(5);

    const page3 = await useCase.execute({ page: 3, limit: 2 });
    expect(page3.items).toHaveLength(1);
  });

  it('sorts by title asc', async () => {
    await projectRepo.save(Project.create({ title: 'Zeta' }));
    await projectRepo.save(Project.create({ title: 'Alpha' }));
    await projectRepo.save(Project.create({ title: 'Mango' }));

    const result = await useCase.execute({ sortBy: 'title', order: 'asc' });
    expect(result.items[0].title).toBe('Alpha');
    expect(result.items[1].title).toBe('Mango');
    expect(result.items[2].title).toBe('Zeta');
  });

  it('sorts by title desc', async () => {
    await projectRepo.save(Project.create({ title: 'Alpha' }));
    await projectRepo.save(Project.create({ title: 'Zeta' }));

    const result = await useCase.execute({ sortBy: 'title', order: 'desc' });
    expect(result.items[0].title).toBe('Zeta');
    expect(result.items[1].title).toBe('Alpha');
  });
});
