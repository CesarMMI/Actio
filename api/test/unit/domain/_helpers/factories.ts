import { Title } from '../../../../src/domain/value-objects/title.value-object';
import { CapturedItem } from '../../../../src/domain/captured-item/captured-item.entity';
import { Action } from '../../../../src/domain/action/action.entity';
import { Project } from '../../../../src/domain/project/project.entity';
import { Context } from '../../../../src/domain/context/context.entity';
import { User } from '../../../../src/domain/user/user.entity';
import { TimeBucket } from '../../../../src/domain/value-objects/time-bucket.value-object';
import { EnergyLevel } from '../../../../src/domain/value-objects/energy-level.value-object';

export function makeTitle(value = 'Default title'): Title {
  return Title.create(value);
}

export function makeCapturedItem(overrides?: {
  id?: string;
  title?: Title;
  notes?: string;
}): CapturedItem {
  return CapturedItem.create({
    id: overrides?.id ?? 'captured-1',
    title: overrides?.title ?? makeTitle('Captured item'),
    notes: overrides?.notes,
  });
}

export function makeAction(overrides?: {
  id?: string;
  title?: Title;
  projectId?: string | null;
  contextId?: string | null;
}): Action {
  return Action.create({
    id: overrides?.id ?? 'action-1',
    title: overrides?.title ?? makeTitle('Action'),
    timeBucket: TimeBucket.create('short'),
    energyLevel: EnergyLevel.create('low'),
    projectId: overrides?.projectId ?? null,
    contextId: overrides?.contextId ?? null,
  });
}

export function makeProject(overrides?: {
  id?: string;
  name?: string;
  description?: string;
}): Project {
  return Project.create({
    id: overrides?.id ?? 'project-1',
    name: overrides?.name ?? 'Project',
    description: overrides?.description,
  });
}

export function makeContext(overrides?: {
  id?: string;
  name?: string;
  description?: string;
}): Context {
  return Context.create({
    id: overrides?.id ?? 'context-1',
    name: overrides?.name ?? 'Home',
    description: overrides?.description,
  });
}

export function makeUser(overrides?: {
  id?: string;
  email?: string;
  passwordHash?: string;
}): User {
  return User.create({
    id: overrides?.id ?? 'user-1',
    email: overrides?.email ?? 'user@example.com',
    passwordHash: overrides?.passwordHash ?? 'hashed-password-123',
  });
}

