import { Project } from '../../../../src/domain/entities/project.entity';
import { Action } from '../../../../src/domain/entities/action.entity';
import { Title } from '../../../../src/domain/value-objects/title.value-object';
import { InvalidStatusTransitionError } from '../../../../src/domain/errors/invalid-status-transition.error';

describe('Project entity', () => {
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

  it('creates ACTIVE project with valid name', () => {
    const project = makeProject();
    expect(project.getStatus()).toBe('ACTIVE');
  });

  it('does not allow completion when there are OPEN actions', () => {
    const project = makeProject();
    const actions = [makeAction('OPEN')];
    expect(() => project.complete(actions)).toThrow(
      InvalidStatusTransitionError,
    );
  });

  it('allows completion when all actions are completed', () => {
    const project = makeProject();
    const actions = [makeAction('COMPLETED')];
    project.complete(actions);
    expect(project.getStatus()).toBe('COMPLETED');
  });

  it('allows archiving from ACTIVE or COMPLETED, but not ARCHIVED again', () => {
    const project = makeProject();
    project.archive();
    expect(project.getStatus()).toBe('ARCHIVED');
    expect(() => project.archive()).toThrow(InvalidStatusTransitionError);
  });

  it('allows renaming with non-empty name', () => {
    const project = makeProject();
    project.rename('  New Name  ');
    expect(project.getName()).toBe('New Name');
  });

  it('rejects empty rename', () => {
    const project = makeProject();
    expect(() => project.rename('   ')).toThrow(
      'Project name cannot be empty.',
    );
  });
});
