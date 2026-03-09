import { ProjectStatus } from '../../src/domain/enums';
import {
  ProjectNotActiveError,
  ProjectHasOpenActionsError,
  ProjectNotCompletedError,
} from '../../src/domain/errors';
import { makeProject } from '../helpers';

describe('Project', () => {
  describe('rename', () => {
    it('updates the name', () => {
      const project = makeProject();
      project.rename('New name');
      expect(project.name).toBe('New name');
    });
  });

  describe('complete', () => {
    it('transitions ACTIVE → COMPLETED when no open actions', () => {
      const project = makeProject({ status: ProjectStatus.ACTIVE });
      project.complete(0);
      expect(project.status).toBe(ProjectStatus.COMPLETED);
    });

    it('throws ProjectHasOpenActionsError when open actions remain', () => {
      const project = makeProject({ status: ProjectStatus.ACTIVE });
      expect(() => project.complete(2)).toThrow(ProjectHasOpenActionsError);
    });

    it('throws ProjectNotActiveError when status is COMPLETED', () => {
      const project = makeProject({ status: ProjectStatus.COMPLETED });
      expect(() => project.complete(0)).toThrow(ProjectNotActiveError);
    });

    it('throws ProjectNotActiveError when status is ARCHIVED', () => {
      const project = makeProject({ status: ProjectStatus.ARCHIVED });
      expect(() => project.complete(0)).toThrow(ProjectNotActiveError);
    });
  });

  describe('archive', () => {
    it('transitions COMPLETED → ARCHIVED', () => {
      const project = makeProject({ status: ProjectStatus.COMPLETED });
      project.archive();
      expect(project.status).toBe(ProjectStatus.ARCHIVED);
    });

    it('throws ProjectNotCompletedError when status is ACTIVE', () => {
      const project = makeProject({ status: ProjectStatus.ACTIVE });
      expect(() => project.archive()).toThrow(ProjectNotCompletedError);
    });

    it('throws ProjectNotCompletedError when status is ARCHIVED', () => {
      const project = makeProject({ status: ProjectStatus.ARCHIVED });
      expect(() => project.archive()).toThrow(ProjectNotCompletedError);
    });
  });
});
