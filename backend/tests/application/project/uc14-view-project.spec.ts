import { ViewProjectUseCase } from '../../../src/application/use-cases/project/view-project.use-case';
import { ProjectNotFoundError } from '../../../src/application/errors';
import { makeAction, makeProject, mockActionRepo, mockProjectRepo } from '../../helpers';

describe('UC-14 — View Project', () => {
  it('returns the project and its actions', async () => {
    const project = makeProject();
    const action = makeAction({ projectId: 'project-1' });
    const projects = mockProjectRepo({ findById: jest.fn().mockResolvedValue(project) });
    const actions = mockActionRepo({ findByFilters: jest.fn().mockResolvedValue([action]) });
    const uc = new ViewProjectUseCase(projects, actions);

    const result = await uc.execute('project-1');

    expect(result.project).toBe(project);
    expect(result.actions).toEqual([action]);
    expect(actions.findByFilters).toHaveBeenCalledWith({ projectId: 'project-1' });
  });

  it('throws ProjectNotFoundError when project does not exist', async () => {
    const projects = mockProjectRepo({ findById: jest.fn().mockResolvedValue(null) });
    const uc = new ViewProjectUseCase(projects, mockActionRepo());
    await expect(uc.execute('missing')).rejects.toThrow(ProjectNotFoundError);
  });
});
