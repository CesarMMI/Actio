import { GetProjectUseCase } from '../../../../src/application/use-cases/project/get-project.use-case';
import { ProjectNotFoundError } from '../../../../src/domain/errors/project-not-found.error';
import { Project } from '../../../../src/domain/entities/project.entity';
import { InMemoryProjectRepository } from '../../mocks/in-memory-project.repository';

describe('UC-P02 — Get Project', () => {
  let useCase: GetProjectUseCase;
  let projectRepo: InMemoryProjectRepository;

  beforeEach(() => {
    projectRepo = new InMemoryProjectRepository();
    useCase = new GetProjectUseCase(projectRepo);
  });

  it('returns the project when it exists', async () => {
    const project = await projectRepo.save(Project.create({ title: 'Build app' }));
    const result = await useCase.execute({ id: project.id });
    expect(result.id).toBe(project.id);
    expect(result.title).toBe('Build app');
  });

  it('throws ProjectNotFoundError when project does not exist', async () => {
    await expect(useCase.execute({ id: 'non-existent' })).rejects.toThrow(ProjectNotFoundError);
  });
});
