import { UpdateProjectUseCase } from '../../../../src/application/use-cases/project/update-project.use-case';
import { InvalidProjectTitleError } from '../../../../src/domain/errors/invalid-project-title.error';
import { ProjectNotFoundError } from '../../../../src/domain/errors/project-not-found.error';
import { ProjectTitleAlreadyExistsError } from '../../../../src/domain/errors/project-title-already-exists.error';
import { Project } from '../../../../src/domain/entities/project.entity';
import { InMemoryProjectRepository } from '../../mocks/in-memory-project.repository';

describe('UC-P04 — Update Project', () => {
  let useCase: UpdateProjectUseCase;
  let projectRepo: InMemoryProjectRepository;

  beforeEach(() => {
    projectRepo = new InMemoryProjectRepository();
    useCase = new UpdateProjectUseCase(projectRepo);
  });

  it('renames a project with a unique title', async () => {
    const project = await projectRepo.save(Project.create({ title: 'Old Title' }));
    const result = await useCase.execute({ id: project.id, title: 'New Title' });
    expect(result.title).toBe('New Title');
  });

  it('allows renaming to the same title (no-op)', async () => {
    const project = await projectRepo.save(Project.create({ title: 'Build app' }));
    const result = await useCase.execute({ id: project.id, title: 'Build app' });
    expect(result.title).toBe('Build app');
  });

  it('throws ProjectNotFoundError when project does not exist', async () => {
    await expect(useCase.execute({ id: 'non-existent', title: 'Title' })).rejects.toThrow(ProjectNotFoundError);
  });

  it('rejects empty title', async () => {
    const project = await projectRepo.save(Project.create({ title: 'Build app' }));
    await expect(useCase.execute({ id: project.id, title: '' })).rejects.toThrow(InvalidProjectTitleError);
  });

  it('rejects title already used by another project', async () => {
    await projectRepo.save(Project.create({ title: 'Other Project' }));
    const project = await projectRepo.save(Project.create({ title: 'My Project' }));
    await expect(useCase.execute({ id: project.id, title: 'other project' })).rejects.toThrow(ProjectTitleAlreadyExistsError);
  });
});
