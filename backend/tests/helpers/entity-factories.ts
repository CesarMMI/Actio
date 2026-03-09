import { CapturedItem } from '../../src/domain/entities/captured-item';
import { Action } from '../../src/domain/entities/action';
import { Project } from '../../src/domain/entities/project';
import { Context } from '../../src/domain/entities/context';
import { CapturedItemStatus, ActionStatus, ProjectStatus } from '../../src/domain/enums';

export function makeCapturedItem(overrides: Partial<ConstructorParameters<typeof CapturedItem>[0]> = {}): CapturedItem {
  return new CapturedItem({
    id: 'item-1',
    title: 'Buy milk',
    status: CapturedItemStatus.INBOX,
    createdAt: new Date(),
    ...overrides,
  });
}

export function makeAction(overrides: Partial<ConstructorParameters<typeof Action>[0]> = {}): Action {
  return new Action({
    id: 'action-1',
    title: 'Write tests',
    status: ActionStatus.OPEN,
    createdAt: new Date(),
    ...overrides,
  });
}

export function makeProject(overrides: Partial<ConstructorParameters<typeof Project>[0]> = {}): Project {
  return new Project({
    id: 'project-1',
    name: 'Build app',
    status: ProjectStatus.ACTIVE,
    createdAt: new Date(),
    ...overrides,
  });
}

export function makeContext(overrides: Partial<ConstructorParameters<typeof Context>[0]> = {}): Context {
  return new Context({
    id: 'ctx-1',
    name: '@computer',
    active: true,
    createdAt: new Date(),
    ...overrides,
  });
}
