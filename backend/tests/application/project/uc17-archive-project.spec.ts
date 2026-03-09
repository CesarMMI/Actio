import { ArchiveProjectUseCase } from '../../../src/application/use-cases/project/archive-project.use-case';
import { ProjectStatus } from '../../../src/domain/enums';
import { ProjectNotFoundError } from '../../../src/application/errors';
import { ProjectNotCompletedError } from '../../../src/domain/errors';
import { makeProject, mockProjectRepo } from '../../helpers';

describe('UC-17 — Archive a Project', () => {
  it('transitions COMPLETED → ARCHIVED', async () => {
    const project = makeProject({ status: ProjectStatus.COMPLETED });
    const repo = mockProjectRepo({ findById: jest.fn().mockResolvedValue(project) });
    const uc = new ArchiveProjectUseCase(repo);

    await uc.execute('project-1');

    expect(project.status).toBe(ProjectStatus.ARCHIVED);
    expect(repo.save).toHaveBeenCalledWith(project);
  });

  it('throws ProjectNotFoundError when project does not exist', async () => {
    const repo = mockProjectRepo({ findById: jest.fn().mockResolvedValue(null) });
    await expect(new ArchiveProjectUseCase(repo).execute('missing'))
      .rejects.toThrow(ProjectNotFoundError);
  });

  it('throws ProjectNotCompletedError when project is ACTIVE', async () => {
    const project = makeProject({ status: ProjectStatus.ACTIVE });
    const repo = mockProjectRepo({ findById: jest.fn().mockResolvedValue(project) });
    await expect(new ArchiveProjectUseCase(repo).execute('project-1'))
      .rejects.toThrow(ProjectNotCompletedError);
  });
});
