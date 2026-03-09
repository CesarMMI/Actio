import { RenameProjectUseCase } from '../../../src/application/use-cases/project/rename-project.use-case';
import { ProjectNotFoundError } from '../../../src/application/errors';
import { makeProject, mockProjectRepo } from '../../helpers';

describe('UC-15 — Rename Project', () => {
  it('updates the project name', async () => {
    const project = makeProject();
    const repo = mockProjectRepo({ findById: jest.fn().mockResolvedValue(project) });
    const uc = new RenameProjectUseCase(repo);

    await uc.execute({ projectId: 'project-1', name: 'New name' });

    expect(project.name).toBe('New name');
    expect(repo.save).toHaveBeenCalledWith(project);
  });

  it('throws ProjectNotFoundError when project does not exist', async () => {
    const repo = mockProjectRepo({ findById: jest.fn().mockResolvedValue(null) });
    await expect(new RenameProjectUseCase(repo).execute({ projectId: 'missing', name: 'x' }))
      .rejects.toThrow(ProjectNotFoundError);
  });
});
