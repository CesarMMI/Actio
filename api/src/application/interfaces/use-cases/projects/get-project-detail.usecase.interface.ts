import {
  GetProjectDetailInput,
  GetProjectDetailOutput,
} from '../../../dtos/projects/get-project-detail.dto';

export const IGetProjectDetailUseCase = Symbol('IGetProjectDetailUseCase');

export interface IGetProjectDetailUseCase {
  execute(input: GetProjectDetailInput): Promise<GetProjectDetailOutput>;
}
