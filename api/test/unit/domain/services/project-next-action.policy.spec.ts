import { ProjectNextActionPolicy } from '../../../../src/domain/services/project-next-action.policy';
import { Project } from '../../../../src/domain/entities/project.entity';
import { Action } from '../../../../src/domain/entities/action.entity';
import { Title } from '../../../../src/domain/value-objects/title.value-object';

describe('Project next action policy', () => {
  const policy = new ProjectNextActionPolicy();

  const makeProject = () =>
    Project.create({
      id: 'project-1',
      name: 'My Project',
    });

  const makeAction = (status: 'OPEN' | 'COMPLETED') => {
    const action = Action.create({
      id: `action-${status}`,
      title: Title.create('Action'),
    });
    if (status === 'COMPLETED') {
      action.complete();
    }
    return action;
  };

  it('returns true when there is at least one OPEN action', () => {
    const project = makeProject();
    const actions = [makeAction('OPEN'), makeAction('COMPLETED')];
    expect(policy.ensureProjectHasNextAction(project, actions)).toBe(true);
  });

  it('returns false when there are no OPEN actions', () => {
    const project = makeProject();
    const actions = [makeAction('COMPLETED')];
    expect(policy.ensureProjectHasNextAction(project, actions)).toBe(false);
  });
});

