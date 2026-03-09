import { CompleteProjectUseCase } from '../../../src/application/use-cases/project/complete-project.use-case';
import { ProjectStatus } from '../../../src/domain/enums';
import { ProjectNotFoundError } from '../../../src/application/errors';
import { ProjectHasOpenActionsError, ProjectNotActiveError } from '../../../src/domain/errors';
import { makeProject, mockProjectRepo, mockActionRepo } from '../../helpers';

describe('UC-16 — Complete a Project', () => {
  it('transitions ACTIVE → COMPLETED when no open actions remain', async () => {
    const project = makeProject({ status: ProjectStatus.ACTIVE });
    const projects = mockProjectRepo({ findById: jest.fn().mockResolvedValue(project) });
    const actions = mockActionRepo({ countOpenByProjectId: jest.fn().mockResolvedValue(0) });
    const uc = new CompleteProjectUseCase(projects, actions);

    await uc.execute('project-1');

    expect(project.status).toBe(ProjectStatus.COMPLETED);
    expect(projects.save).toHaveBeenCalledWith(project);
  });

  it('throws ProjectHasOpenActionsError when open actions remain', async () => {
    const project = makeProject({ status: ProjectStatus.ACTIVE });
    const projects = mockProjectRepo({ findById: jest.fn().mockResolvedValue(project) });
    const actions = mockActionRepo({ countOpenByProjectId: jest.fn().mockResolvedValue(2) });
    const uc = new CompleteProjectUseCase(projects, actions);

    await expect(uc.execute('project-1')).rejects.toThrow(ProjectHasOpenActionsError);
  });

  it('throws ProjectNotFoundError when project does not exist', async () => {
    const projects = mockProjectRepo({ findById: jest.fn().mockResolvedValue(null) });
    const uc = new CompleteProjectUseCase(projects, mockActionRepo());
    await expect(uc.execute('missing')).rejects.toThrow(ProjectNotFoundError);
  });

  it('throws ProjectNotActiveError when project is already COMPLETED', async () => {
    const project = makeProject({ status: ProjectStatus.COMPLETED });
    const projects = mockProjectRepo({ findById: jest.fn().mockResolvedValue(project) });
    const actions = mockActionRepo({ countOpenByProjectId: jest.fn().mockResolvedValue(0) });
    const uc = new CompleteProjectUseCase(projects, actions);

    await expect(uc.execute('project-1')).rejects.toThrow(ProjectNotActiveError);
  });
});
