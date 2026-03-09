import { Inject, Injectable } from '@nestjs/common';
import { Project } from '../../../domain/entities/project.entity';
import { IProjectRepository } from '../../../domain/interfaces/repositories/project-repository.interface';
import { IIdGenerator } from '../../interfaces/services/id-generator.interface';
import {
  CreateProjectInput,
  CreateProjectOutput,
} from '../../dtos/projects/create-project.dto';
import { toProjectDto } from '../../mappers/project.mapper';
import { ICreateProjectUseCase } from '../../interfaces/use-cases/projects/create-project.usecase.interface';

@Injectable()
export class CreateProjectUseCase implements ICreateProjectUseCase {
  constructor(
    @Inject(IProjectRepository) private readonly projects: IProjectRepository,
    @Inject(IIdGenerator) private readonly ids: IIdGenerator,
  ) {}

  async execute(input: CreateProjectInput): Promise<CreateProjectOutput> {
    const project = Project.create({
      id: this.ids.newId(),
      name: input.name,
      description: input.description,
    });

    const saved = await this.projects.saveForUser(input.userId, project);
    return { project: toProjectDto(saved) };
  }
}
