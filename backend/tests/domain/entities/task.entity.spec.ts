import { Task } from '../../../src/domain/entities/task.entity';
import { InvalidTaskDescriptionError } from '../../../src/domain/errors/invalid-task-description.error';
import { TaskAlreadyHasChildError } from '../../../src/domain/errors/task-already-has-child.error';
import { TaskAlreadyHasParentError } from '../../../src/domain/errors/task-already-has-parent.error';
import { TaskSelfReferenceError } from '../../../src/domain/errors/task-self-reference.error';

describe('Task entity', () => {
  describe('Task.create', () => {
    it('creates a task with a valid description', () => {
      const task = Task.create({ description: 'Buy milk' });
      expect(task.description).toBe('Buy milk');
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
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

  describe('Task.reconstitute', () => {
    it('reconstitutes a task with all fields', () => {
      const now = new Date();
      const task = Task.reconstitute({
        id: 'task-1',
        description: 'Reconstituted',
        contextId: 'ctx-1',
        projectId: 'proj-1',
        parentTaskId: 'parent-1',
        childTaskId: 'child-1',
        createdAt: now,
        updatedAt: now,
      });
      expect(task.id).toBe('task-1');
      expect(task.description).toBe('Reconstituted');
      expect(task.contextId).toBe('ctx-1');
      expect(task.projectId).toBe('proj-1');
      expect(task.parentTaskId).toBe('parent-1');
      expect(task.childTaskId).toBe('child-1');
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

  describe('assignChild', () => {
    it('assigns a child task id', () => {
      const task = Task.create({ description: 'Parent' });
      task.assignChild('child-id');
      expect(task.childTaskId).toBe('child-id');
    });

    it('refreshes updatedAt on assign child', () => {
      const task = Task.create({ description: 'Parent' });
      const before = task.updatedAt;
      task.assignChild('child-id');
      expect(task.updatedAt >= before).toBe(true);
    });

    it('throws TaskAlreadyHasChildError if child already assigned', () => {
      const task = Task.create({ description: 'Parent' });
      task.assignChild('child-1');
      expect(() => task.assignChild('child-2')).toThrow(TaskAlreadyHasChildError);
    });

    it('throws TaskSelfReferenceError if child is the task itself', () => {
      const task = Task.create({ description: 'Parent' });
      expect(() => task.assignChild(task.id)).toThrow(TaskSelfReferenceError);
    });
  });

  describe('assignParent', () => {
    it('assigns a parent task id', () => {
      const task = Task.create({ description: 'Child' });
      task.assignParent('parent-id');
      expect(task.parentTaskId).toBe('parent-id');
    });

    it('refreshes updatedAt on assign parent', () => {
      const task = Task.create({ description: 'Child' });
      const before = task.updatedAt;
      task.assignParent('parent-id');
      expect(task.updatedAt >= before).toBe(true);
    });

    it('throws TaskAlreadyHasParentError if parent already assigned', () => {
      const task = Task.create({ description: 'Child' });
      task.assignParent('parent-1');
      expect(() => task.assignParent('parent-2')).toThrow(TaskAlreadyHasParentError);
    });

    it('throws TaskSelfReferenceError if parent is the task itself', () => {
      const task = Task.create({ description: 'Child' });
      expect(() => task.assignParent(task.id)).toThrow(TaskSelfReferenceError);
    });
  });

  describe('removeChild', () => {
    it('removes child task id', () => {
      const task = Task.create({ description: 'Parent' });
      task.assignChild('child-id');
      task.removeChild();
      expect(task.childTaskId).toBeUndefined();
    });

    it('refreshes updatedAt on remove child', () => {
      const task = Task.create({ description: 'Parent' });
      task.assignChild('child-id');
      const before = task.updatedAt;
      task.removeChild();
      expect(task.updatedAt >= before).toBe(true);
    });
  });

  describe('removeParent', () => {
    it('removes parent task id', () => {
      const task = Task.create({ description: 'Child' });
      task.assignParent('parent-id');
      task.removeParent();
      expect(task.parentTaskId).toBeUndefined();
    });

    it('refreshes updatedAt on remove parent', () => {
      const task = Task.create({ description: 'Child' });
      task.assignParent('parent-id');
      const before = task.updatedAt;
      task.removeParent();
      expect(task.updatedAt >= before).toBe(true);
    });
  });
});
