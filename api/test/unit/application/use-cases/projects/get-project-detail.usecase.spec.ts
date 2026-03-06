import { GetProjectDetailUseCase } from '../../../../../src/application/use-cases/projects/get-project-detail.usecase';
import { IActionRepository } from '../../../../../src/domain/interfaces/repositories/action-repository.interface';
import { IProjectRepository } from '../../../../../src/domain/interfaces/repositories/project-repository.interface';
import { Project } from '../../../../../src/domain/entities/project.entity';
import { Action } from '../../../../../src/domain/entities/action.entity';
import { Title } from '../../../../../src/domain/value-objects/title.value-object';
import { EntityNotFoundError } from '../../../../../src/domain/errors/entity-not-found.error';

describe('GetProjectDetailUseCase', () => {
  const makeProjects = (): jest.Mocked<IProjectRepository> => ({
    saveForUser: jest.fn(),
    findByIdForUser: jest.fn(),
    findAllByUser: jest.fn(),
  });

  const makeActions = (): jest.Mocked<IActionRepository> => ({
    saveForUser: jest.fn(),
    saveManyForUser: jest.fn(),
    findByIdForUser: jest.fn(),
    findOpenByContext: jest.fn(),
    findByProject: jest.fn(),
  });

  it('throws EntityNotFoundError when project does not exist', async () => {
    const projects = makeProjects();
    const actions = makeActions();
    projects.findByIdForUser.mockResolvedValue(null);

    const useCase = new GetProjectDetailUseCase(projects, actions);
    await expect(
      useCase.execute({ userId: 'user-1', projectId: 'missing' }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it('returns project and partitions actions by status', async () => {
    const projects = makeProjects();
    const actions = makeActions();

    const project = Project.create({ id: 'p1', name: 'P1' });
    projects.findByIdForUser.mockResolvedValue(project);

    const open = Action.create({ id: 'a1', title: Title.create('Open') });
    const done = Action.create({ id: 'a2', title: Title.create('Done') });
    done.complete();

    actions.findByProject.mockResolvedValue([done, open]);

    const useCase = new GetProjectDetailUseCase(projects, actions);
    const result = await useCase.execute({ userId: 'user-1', projectId: 'p1' });

    expect(result.project).toMatchObject({
      id: 'p1',
      name: 'P1',
      status: 'ACTIVE',
    });
    expect(result.openActions.map((a) => a.id)).toEqual(['a1']);
    expect(result.completedActions.map((a) => a.id)).toEqual(['a2']);
  });
});
