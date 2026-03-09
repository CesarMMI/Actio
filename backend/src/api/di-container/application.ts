import {
  IQuickCaptureUseCase, QuickCaptureUseCase,
  ICaptureAndResolveUseCase, CaptureAndResolveUseCase,
  IViewInboxUseCase, ViewInboxUseCase,
  IClarifyAsActionUseCase, ClarifyAsActionUseCase,
  IClarifyAsProjectUseCase, ClarifyAsProjectUseCase,
  IClarifyAsReferenceUseCase, ClarifyAsReferenceUseCase,
  IClarifyAsSomedayUseCase, ClarifyAsSomedayUseCase,
  IMoveToTrashUseCase, MoveToTrashUseCase,
  IViewActionsUseCase, ViewActionsUseCase,
  IAssignActionToProjectUseCase, AssignActionToProjectUseCase,
  IAssignActionToContextUseCase, AssignActionToContextUseCase,
  ICompleteActionUseCase, CompleteActionUseCase,
  IArchiveActionUseCase, ArchiveActionUseCase,
  IViewProjectUseCase, ViewProjectUseCase,
  IRenameProjectUseCase, RenameProjectUseCase,
  ICompleteProjectUseCase, CompleteProjectUseCase,
  IArchiveProjectUseCase, ArchiveProjectUseCase,
  ICreateContextUseCase, CreateContextUseCase,
  IRenameContextUseCase, RenameContextUseCase,
  IActivateContextUseCase, ActivateContextUseCase,
  IDeactivateContextUseCase, DeactivateContextUseCase,
  IExecuteByContextUseCase, ExecuteByContextUseCase,
} from '../../application';
import { Repositories } from './infrastructure';

export interface UseCases {
  quickCapture: IQuickCaptureUseCase;
  captureAndResolve: ICaptureAndResolveUseCase;
  viewInbox: IViewInboxUseCase;
  clarifyAsAction: IClarifyAsActionUseCase;
  clarifyAsProject: IClarifyAsProjectUseCase;
  clarifyAsReference: IClarifyAsReferenceUseCase;
  clarifyAsSomeday: IClarifyAsSomedayUseCase;
  moveToTrash: IMoveToTrashUseCase;
  viewActions: IViewActionsUseCase;
  assignActionToProject: IAssignActionToProjectUseCase;
  assignActionToContext: IAssignActionToContextUseCase;
  completeAction: ICompleteActionUseCase;
  archiveAction: IArchiveActionUseCase;
  viewProject: IViewProjectUseCase;
  renameProject: IRenameProjectUseCase;
  completeProject: ICompleteProjectUseCase;
  archiveProject: IArchiveProjectUseCase;
  createContext: ICreateContextUseCase;
  renameContext: IRenameContextUseCase;
  activateContext: IActivateContextUseCase;
  deactivateContext: IDeactivateContextUseCase;
  executeByContext: IExecuteByContextUseCase;
}

export function buildUseCases(repos: Repositories): UseCases {
  const { capturedItems, actions, projects, contexts } = repos;

  return {
    quickCapture: new QuickCaptureUseCase(capturedItems),
    captureAndResolve: new CaptureAndResolveUseCase(capturedItems, actions),
    viewInbox: new ViewInboxUseCase(capturedItems),
    clarifyAsAction: new ClarifyAsActionUseCase(capturedItems, actions),
    clarifyAsProject: new ClarifyAsProjectUseCase(capturedItems, projects),
    clarifyAsReference: new ClarifyAsReferenceUseCase(capturedItems),
    clarifyAsSomeday: new ClarifyAsSomedayUseCase(capturedItems),
    moveToTrash: new MoveToTrashUseCase(capturedItems),
    viewActions: new ViewActionsUseCase(actions),
    assignActionToProject: new AssignActionToProjectUseCase(actions, projects),
    assignActionToContext: new AssignActionToContextUseCase(actions, contexts),
    completeAction: new CompleteActionUseCase(actions),
    archiveAction: new ArchiveActionUseCase(actions),
    viewProject: new ViewProjectUseCase(projects, actions),
    renameProject: new RenameProjectUseCase(projects),
    completeProject: new CompleteProjectUseCase(projects, actions),
    archiveProject: new ArchiveProjectUseCase(projects),
    createContext: new CreateContextUseCase(contexts),
    renameContext: new RenameContextUseCase(contexts),
    activateContext: new ActivateContextUseCase(contexts),
    deactivateContext: new DeactivateContextUseCase(contexts),
    executeByContext: new ExecuteByContextUseCase(contexts, actions),
  };
}
