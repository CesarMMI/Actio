import { v4 as uuidv4 } from 'uuid';
import { Project } from '../../../domain/entities/project';
import { ProjectStatus } from '../../../domain/enums';
import { ICapturedItemRepository, IProjectRepository } from '../../../domain/interfaces';
import { CapturedItemNotFoundError } from '../../errors/captured-item-not-found.error';
import { IClarifyAsProjectUseCase, ClarifyAsProjectInput } from '../../interfaces/captured-item/clarify-as-project.use-case.interface';

export class ClarifyAsProjectUseCase implements IClarifyAsProjectUseCase {
  constructor(
    private readonly capturedItems: ICapturedItemRepository,
    private readonly projects: IProjectRepository,
  ) {}

  async execute(input: ClarifyAsProjectInput): Promise<Project> {
    const item = await this.capturedItems.findById(input.capturedItemId);
    if (!item) throw new CapturedItemNotFoundError(input.capturedItemId);

    item.clarifyAsProject();

    const project = new Project({
      id: uuidv4(),
      name: input.projectName,
      description: input.projectDescription,
      status: ProjectStatus.ACTIVE,
      createdAt: new Date(),
    });

    await this.capturedItems.save(item);
    await this.projects.save(project);

    return project;
  }
}
