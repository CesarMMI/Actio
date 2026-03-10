import { Project } from "../../../domain/entities/project/project.entity";
import { ProjectTitleAlreadyExistsError } from "../../../domain/errors/project/project-title-already-exists.error";
import { IProjectRepository } from "../../../domain/interfaces/project-repository.interface";
import { ICreateProjectUseCase } from "../../interfaces/project/create-project.use-case.interface";
import type { CreateProjectInput } from "../../types/inputs/project/create-project.input";
import type { CreateProjectOutput } from "../../types/outputs/project/create-project.output";

export class CreateProjectUseCase implements ICreateProjectUseCase {
  constructor(private readonly projects: IProjectRepository) {}

  async execute(input: CreateProjectInput): Promise<CreateProjectOutput> {
    const existing = await this.projects.findByTitle(input.title);
    if (existing) throw new ProjectTitleAlreadyExistsError(input.title);

    const project = Project.create(input);
    return this.projects.save(project);
  }
}
