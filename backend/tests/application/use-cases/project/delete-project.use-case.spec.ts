import { DeleteProjectUseCase } from '../../../../src/application/use-cases/project/delete-project.use-case';
import { ProjectHasTasksError } from '../../../../src/domain/errors/project/project-has-tasks.error';
import { ProjectNotFoundError } from '../../../../src/domain/errors/project/project-not-found.error';
import { Project } from '../../../../src/domain/entities/project/project.entity';
import { Task } from '../../../../src/domain/entities/task/task.entity';
import { InMemoryProjectRepository } from '../../mocks/in-memory-project.repository';
import { InMemoryTaskRepository } from '../../mocks/in-memory-task.repository';

describe('UC-P05 — Delete Project', () => {
  let useCase: DeleteProjectUseCase;
  let projectRepo: InMemoryProjectRepository;
  let taskRepo: InMemoryTaskRepository;

  beforeEach(() => {
    projectRepo = new InMemoryProjectRepository();
    taskRepo = new InMemoryTaskRepository();
    useCase = new DeleteProjectUseCase(projectRepo, taskRepo);
  });

  it('deletes a project with no referencing tasks', async () => {
    const project = await projectRepo.save(Project.create({ title: 'Build app' }));
    await useCase.execute({ id: project.id });
    expect(await projectRepo.findById(project.id)).toBeNull();
  });

  it('throws ProjectNotFoundError when project does not exist', async () => {
    await expect(useCase.execute({ id: 'non-existent' })).rejects.toThrow(ProjectNotFoundError);
  });

  it('throws ProjectHasTasksError when tasks reference this project', async () => {
    const project = await projectRepo.save(Project.create({ title: 'Build app' }));
    await taskRepo.save(Task.create({ description: 'Task', projectId: project.id }));
    await expect(useCase.execute({ id: project.id })).rejects.toThrow(ProjectHasTasksError);
  });
});
