import { AssignActionToProjectUseCase } from '../../../src/application/use-cases/action/assign-action-to-project.use-case';
import { ActionNotFoundError, ProjectNotFoundError } from '../../../src/application/errors';
import { makeAction, makeProject, mockActionRepo, mockProjectRepo } from '../../helpers';

describe('UC-10 — Assign Action to Project', () => {
  it('sets projectId on the action', async () => {
    const action = makeAction();
    const project = makeProject();
    const actions = mockActionRepo({ findById: jest.fn().mockResolvedValue(action) });
    const projects = mockProjectRepo({ findById: jest.fn().mockResolvedValue(project) });
    const uc = new AssignActionToProjectUseCase(actions, projects);

    await uc.execute({ actionId: 'action-1', projectId: 'project-1' });

    expect(action.projectId).toBe('project-1');
    expect(actions.save).toHaveBeenCalledWith(action);
  });

  it('clears projectId when null is passed', async () => {
    const action = makeAction({ projectId: 'project-1' });
    const actions = mockActionRepo({ findById: jest.fn().mockResolvedValue(action) });
    const uc = new AssignActionToProjectUseCase(actions, mockProjectRepo());

    await uc.execute({ actionId: 'action-1', projectId: null });

    expect(action.projectId).toBeUndefined();
  });

  it('throws ActionNotFoundError when action does not exist', async () => {
    const actions = mockActionRepo({ findById: jest.fn().mockResolvedValue(null) });
    const uc = new AssignActionToProjectUseCase(actions, mockProjectRepo());
    await expect(uc.execute({ actionId: 'missing', projectId: 'p-1' }))
      .rejects.toThrow(ActionNotFoundError);
  });

  it('throws ProjectNotFoundError when project does not exist', async () => {
    const action = makeAction();
    const actions = mockActionRepo({ findById: jest.fn().mockResolvedValue(action) });
    const projects = mockProjectRepo({ findById: jest.fn().mockResolvedValue(null) });
    const uc = new AssignActionToProjectUseCase(actions, projects);
    await expect(uc.execute({ actionId: 'action-1', projectId: 'missing' }))
      .rejects.toThrow(ProjectNotFoundError);
  });
});
