import { CreateProjectUseCase } from '../../../../src/application/use-cases/project/create-project.use-case';
import { InvalidProjectTitleError } from '../../../../src/domain/errors/invalid-project-title.error';
import { ProjectTitleAlreadyExistsError } from '../../../../src/domain/errors/project-title-already-exists.error';
import { InMemoryProjectRepository } from '../../mocks/in-memory-project.repository';

describe('UC-P01 — Create Project', () => {
  let useCase: CreateProjectUseCase;
  let projectRepo: InMemoryProjectRepository;

  beforeEach(() => {
    projectRepo = new InMemoryProjectRepository();
    useCase = new CreateProjectUseCase(projectRepo);
  });

  it('creates a project with a valid title', async () => {
    const result = await useCase.execute({ title: 'Build app' });
    expect(result.title).toBe('Build app');
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });

  it('rejects empty title', async () => {
    await expect(useCase.execute({ title: '   ' })).rejects.toThrow(InvalidProjectTitleError);
  });

  it('rejects duplicate title (case-insensitive)', async () => {
    await useCase.execute({ title: 'Build app' });
    await expect(useCase.execute({ title: 'build app' })).rejects.toThrow(ProjectTitleAlreadyExistsError);
  });
});
