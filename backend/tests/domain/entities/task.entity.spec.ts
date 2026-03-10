import { Task } from '../../../src/domain/entities/task/task.entity';
import { InvalidTaskDescriptionError } from '../../../src/domain/errors/task/invalid-task-description.error';
import { TaskAlreadyDoneError } from '../../../src/domain/errors/task/task-already-done.error';
import { TaskNotDoneError } from '../../../src/domain/errors/task/task-not-done.error';

describe('Task entity', () => {
  describe('Task.create', () => {
    it('creates a task with a valid description', () => {
      const task = Task.create({ description: 'Buy milk' });
      expect(task.description).toBe('Buy milk');
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
      expect(task.done).toBe(false);
      expect(task.doneAt).toBeUndefined();
    });

    it('rejects empty description', () => {
      expect(() => Task.create({ description: '' })).toThrow(InvalidTaskDescriptionError);
    });

    it('rejects whitespace-only description', () => {
      expect(() => Task.create({ description: '   ' })).toThrow(InvalidTaskDescriptionError);
    });

    it('creates a task with optional contextId', () => {
      const task = Task.create({ description: 'Buy milk', contextId: 'ctx-1' });
      expect(task.contextId).toBe('ctx-1');
    });

    it('creates a task with optional projectId', () => {
      const task = Task.create({ description: 'Buy milk', projectId: 'proj-1' });
      expect(task.projectId).toBe('proj-1');
    });

    it('generates unique ids for each task', () => {
      const t1 = Task.create({ description: 'Task 1' });
      const t2 = Task.create({ description: 'Task 2' });
      expect(t1.id).not.toBe(t2.id);
    });
  });

  describe('Task.load', () => {
    it('loads a task with all fields', () => {
      const now = new Date();
      const task = Task.load({
        id: 'task-1',
        description: 'Loaded',
        done: false,
        contextId: 'ctx-1',
        projectId: 'proj-1',
        createdAt: now,
        updatedAt: now,
      });
      expect(task.id).toBe('task-1');
      expect(task.description).toBe('Loaded');
      expect(task.contextId).toBe('ctx-1');
      expect(task.projectId).toBe('proj-1');
    });
  });

  describe('updateDescription', () => {
    it('updates description with valid value', () => {
      const task = Task.create({ description: 'Original' });
      task.updateDescription('Updated');
      expect(task.description).toBe('Updated');
    });

    it('refreshes updatedAt on description update', () => {
      const task = Task.create({ description: 'Original' });
      const before = task.updatedAt;
      task.updateDescription('Updated');
      expect(task.updatedAt >= before).toBe(true);
    });

    it('rejects empty description update', () => {
      const task = Task.create({ description: 'Original' });
      expect(() => task.updateDescription('')).toThrow(InvalidTaskDescriptionError);
    });

    it('rejects whitespace-only description update', () => {
      const task = Task.create({ description: 'Original' });
      expect(() => task.updateDescription('   ')).toThrow(InvalidTaskDescriptionError);
    });
  });

  describe('assignContext', () => {
    it('assigns a context', () => {
      const task = Task.create({ description: 'Task' });
      task.assignContext('ctx-1');
      expect(task.contextId).toBe('ctx-1');
    });

    it('clears context with null', () => {
      const task = Task.create({ description: 'Task', contextId: 'ctx-1' });
      task.assignContext(null);
      expect(task.contextId).toBeUndefined();
    });

    it('refreshes updatedAt on context assignment', () => {
      const task = Task.create({ description: 'Task' });
      const before = task.updatedAt;
      task.assignContext('ctx-1');
      expect(task.updatedAt >= before).toBe(true);
    });
  });

  describe('complete', () => {
    it('sets done to true and doneAt to current timestamp', () => {
      const task = Task.create({ description: 'Task' });
      const before = new Date();
      task.complete();
      expect(task.done).toBe(true);
      expect(task.doneAt).toBeInstanceOf(Date);
      expect(task.doneAt!.getTime()).toBeGreaterThanOrEqual(before.getTime());
    });

    it('refreshes updatedAt', () => {
      const task = Task.create({ description: 'Task' });
      const before = task.updatedAt;
      task.complete();
      expect(task.updatedAt >= before).toBe(true);
    });

    it('throws TaskAlreadyDoneError if already done', () => {
      const task = Task.create({ description: 'Task' });
      task.complete();
      expect(() => task.complete()).toThrow(TaskAlreadyDoneError);
    });
  });

  describe('reopen', () => {
    it('sets done to false and clears doneAt', () => {
      const task = Task.create({ description: 'Task' });
      task.complete();
      task.reopen();
      expect(task.done).toBe(false);
      expect(task.doneAt).toBeUndefined();
    });

    it('refreshes updatedAt', () => {
      const task = Task.create({ description: 'Task' });
      task.complete();
      const before = task.updatedAt;
      task.reopen();
      expect(task.updatedAt >= before).toBe(true);
    });

    it('throws TaskNotDoneError if not done', () => {
      const task = Task.create({ description: 'Task' });
      expect(() => task.reopen()).toThrow(TaskNotDoneError);
    });
  });

  describe('assignProject', () => {
    it('assigns a project', () => {
      const task = Task.create({ description: 'Task' });
      task.assignProject('proj-1');
      expect(task.projectId).toBe('proj-1');
    });

    it('clears project with null', () => {
      const task = Task.create({ description: 'Task', projectId: 'proj-1' });
      task.assignProject(null);
      expect(task.projectId).toBeUndefined();
    });

    it('refreshes updatedAt on project assignment', () => {
      const task = Task.create({ description: 'Task' });
      const before = task.updatedAt;
      task.assignProject('proj-1');
      expect(task.updatedAt >= before).toBe(true);
    });
  });
});
