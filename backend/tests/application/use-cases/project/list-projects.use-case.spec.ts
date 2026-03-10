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

  it('returns empty array when no projects exist', async () => {
    expect(await useCase.execute()).toEqual([]);
  });

  it('returns all projects', async () => {
    await projectRepo.save(Project.create({ title: 'Project A' }));
    await projectRepo.save(Project.create({ title: 'Project B' }));
    const result = await useCase.execute();
    expect(result).toHaveLength(2);
  });
});
