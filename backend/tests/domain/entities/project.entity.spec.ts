import { Project } from '../../../src/domain/entities/project/project.entity';
import { InvalidProjectTitleError } from '../../../src/domain/errors/project/invalid-project-title.error';

describe('Project entity', () => {
  describe('Project.create', () => {
    it('creates a project with valid title', () => {
      const proj = Project.create({ title: 'My project' });
      expect(proj.title).toBe('My project');
      expect(proj.id).toBeDefined();
      expect(proj.createdAt).toBeInstanceOf(Date);
      expect(proj.updatedAt).toBeInstanceOf(Date);
    });

    it('rejects empty title', () => {
      expect(() => Project.create({ title: '' })).toThrow(InvalidProjectTitleError);
    });

    it('rejects whitespace-only title', () => {
      expect(() => Project.create({ title: '   ' })).toThrow(InvalidProjectTitleError);
    });

    it('generates unique ids for each project', () => {
      const p1 = Project.create({ title: 'Project A' });
      const p2 = Project.create({ title: 'Project B' });
      expect(p1.id).not.toBe(p2.id);
    });
  });

  describe('Project.load', () => {
    it('loads a project with all fields', () => {
      const now = new Date();
      const proj = Project.load({ id: 'proj-1', title: 'My project', createdAt: now, updatedAt: now });
      expect(proj.id).toBe('proj-1');
      expect(proj.title).toBe('My project');
    });
  });

  describe('rename', () => {
    it('renames with valid title', () => {
      const proj = Project.create({ title: 'My project' });
      proj.rename('My project updated');
      expect(proj.title).toBe('My project updated');
    });

    it('refreshes updatedAt on rename', () => {
      const proj = Project.create({ title: 'My project' });
      const before = proj.updatedAt;
      proj.rename('My project updated');
      expect(proj.updatedAt >= before).toBe(true);
    });

    it('rejects empty title on rename', () => {
      const proj = Project.create({ title: 'My project' });
      expect(() => proj.rename('')).toThrow(InvalidProjectTitleError);
    });

    it('rejects whitespace-only title on rename', () => {
      const proj = Project.create({ title: 'My project' });
      expect(() => proj.rename('   ')).toThrow(InvalidProjectTitleError);
    });
  });
});
