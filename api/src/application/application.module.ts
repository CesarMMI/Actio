import { Module } from '@nestjs/common';

import { AssignActionToContextUseCase } from './use-cases/actions/assign-action-to-context.usecase';
import { AssignActionToProjectUseCase } from './use-cases/actions/assign-action-to-project.usecase';
import { CompleteActionUseCase } from './use-cases/actions/complete-action.usecase';
import { ListActionsByContextUseCase } from './use-cases/actions/list-actions-by-context.usecase';

import { LoginUseCase } from './use-cases/auth/login.usecase';
import { RegisterUserUseCase } from './use-cases/auth/register-user.usecase';

import { CaptureItemUseCase } from './use-cases/captured-items/capture-item.usecase';
import { ClarifyCapturedItemAsActionUseCase } from './use-cases/captured-items/clarify-captured-item-as-action.usecase';
import { ClarifyCapturedItemAsProjectUseCase } from './use-cases/captured-items/clarify-captured-item-as-project.usecase';
import { ClarifyCapturedItemAsReferenceUseCase } from './use-cases/captured-items/clarify-captured-item-as-reference.usecase';
import { ClarifyCapturedItemAsSomedayUseCase } from './use-cases/captured-items/clarify-captured-item-as-someday.usecase';
import { TrashCapturedItemUseCase } from './use-cases/captured-items/trash-captured-item.usecase';

import { CreateContextUseCase } from './use-cases/contexts/create-context.usecase';
import { DeactivateContextUseCase } from './use-cases/contexts/deactivate-context.usecase';
import { ListContextsUseCase } from './use-cases/contexts/list-contexts.usecase';
import { RenameContextUseCase } from './use-cases/contexts/rename-context.usecase';

import { ArchiveProjectUseCase } from './use-cases/projects/archive-project.usecase';
import { CreateProjectUseCase } from './use-cases/projects/create-project.usecase';
import { GetProjectDetailUseCase } from './use-cases/projects/get-project-detail.usecase';
import { ListProjectsUseCase } from './use-cases/projects/list-projects.usecase';
import { RenameProjectUseCase } from './use-cases/projects/rename-project.usecase';

import { IAssignActionToContextUseCase } from './interfaces/use-cases/actions/assign-action-to-context.usecase.interface';
import { IAssignActionToProjectUseCase } from './interfaces/use-cases/actions/assign-action-to-project.usecase.interface';
import { ICompleteActionUseCase } from './interfaces/use-cases/actions/complete-action.usecase.interface';
import { IListActionsByContextUseCase } from './interfaces/use-cases/actions/list-actions-by-context.usecase.interface';

import { ILoginUseCase } from './interfaces/use-cases/auth/login.usecase.interface';
import { IRegisterUserUseCase } from './interfaces/use-cases/auth/register-user.usecase.interface';

import { ICaptureItemUseCase } from './interfaces/use-cases/captured-items/capture-item.usecase.interface';
import { IClarifyCapturedItemAsActionUseCase } from './interfaces/use-cases/captured-items/clarify-captured-item-as-action.usecase.interface';
import { IClarifyCapturedItemAsProjectUseCase } from './interfaces/use-cases/captured-items/clarify-captured-item-as-project.usecase.interface';
import { IClarifyCapturedItemAsReferenceUseCase } from './interfaces/use-cases/captured-items/clarify-captured-item-as-reference.usecase.interface';
import { IClarifyCapturedItemAsSomedayUseCase } from './interfaces/use-cases/captured-items/clarify-captured-item-as-someday.usecase.interface';
import { ITrashCapturedItemUseCase } from './interfaces/use-cases/captured-items/trash-captured-item.usecase.interface';

import { ICreateContextUseCase } from './interfaces/use-cases/contexts/create-context.usecase.interface';
import { IDeactivateContextUseCase } from './interfaces/use-cases/contexts/deactivate-context.usecase.interface';
import { IListContextsUseCase } from './interfaces/use-cases/contexts/list-contexts.usecase.interface';
import { IRenameContextUseCase } from './interfaces/use-cases/contexts/rename-context.usecase.interface';

import { IArchiveProjectUseCase } from './interfaces/use-cases/projects/archive-project.usecase.interface';
import { ICreateProjectUseCase } from './interfaces/use-cases/projects/create-project.usecase.interface';
import { IGetProjectDetailUseCase } from './interfaces/use-cases/projects/get-project-detail.usecase.interface';
import { IListProjectsUseCase } from './interfaces/use-cases/projects/list-projects.usecase.interface';
import { IRenameProjectUseCase } from './interfaces/use-cases/projects/rename-project.usecase.interface';

const useCaseProviders = [
  { provide: IAssignActionToContextUseCase, useClass: AssignActionToContextUseCase },
  { provide: IAssignActionToProjectUseCase, useClass: AssignActionToProjectUseCase },
  { provide: ICompleteActionUseCase, useClass: CompleteActionUseCase },
  { provide: IListActionsByContextUseCase, useClass: ListActionsByContextUseCase },

  { provide: ILoginUseCase, useClass: LoginUseCase },
  { provide: IRegisterUserUseCase, useClass: RegisterUserUseCase },

  { provide: ICaptureItemUseCase, useClass: CaptureItemUseCase },
  { provide: IClarifyCapturedItemAsActionUseCase, useClass: ClarifyCapturedItemAsActionUseCase },
  { provide: IClarifyCapturedItemAsProjectUseCase, useClass: ClarifyCapturedItemAsProjectUseCase },
  { provide: IClarifyCapturedItemAsReferenceUseCase, useClass: ClarifyCapturedItemAsReferenceUseCase },
  { provide: IClarifyCapturedItemAsSomedayUseCase, useClass: ClarifyCapturedItemAsSomedayUseCase },
  { provide: ITrashCapturedItemUseCase, useClass: TrashCapturedItemUseCase },

  { provide: ICreateContextUseCase, useClass: CreateContextUseCase },
  { provide: IDeactivateContextUseCase, useClass: DeactivateContextUseCase },
  { provide: IListContextsUseCase, useClass: ListContextsUseCase },
  { provide: IRenameContextUseCase, useClass: RenameContextUseCase },

  { provide: IArchiveProjectUseCase, useClass: ArchiveProjectUseCase },
  { provide: ICreateProjectUseCase, useClass: CreateProjectUseCase },
  { provide: IGetProjectDetailUseCase, useClass: GetProjectDetailUseCase },
  { provide: IListProjectsUseCase, useClass: ListProjectsUseCase },
  { provide: IRenameProjectUseCase, useClass: RenameProjectUseCase },
];

@Module({
  providers: useCaseProviders,
  exports: useCaseProviders,
})
export class ApplicationModule {}
