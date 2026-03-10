import { Request, Response, NextFunction } from 'express';
import {
  TaskNotFoundError,
  ContextNotFoundError,
  ProjectNotFoundError,
  InvalidTaskDescriptionError,
  InvalidContextTitleError,
  InvalidProjectTitleError,
  ContextHasTasksError,
  ProjectHasTasksError,
  ContextTitleAlreadyExistsError,
  ProjectTitleAlreadyExistsError,
  TaskAlreadyHasChildError,
  TaskAlreadyHasParentError,
  TaskCircularReferenceError,
  TaskSelfReferenceError,
  TaskHasNoChildError,
} from '../../domain/errors';

const BASE = 'https://actio.app/errors';

function problem(
  res: Response,
  req: Request,
  status: number,
  slug: string,
  title: string,
  detail: string,
): void {
  res.status(status).json({ type: `${BASE}/${slug}`, title, status, detail, instance: req.path });
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof TaskNotFoundError) {
    problem(res, req, 404, 'task-not-found', 'Task Not Found', err.message);
  } else if (err instanceof ContextNotFoundError) {
    problem(res, req, 404, 'context-not-found', 'Context Not Found', err.message);
  } else if (err instanceof ProjectNotFoundError) {
    problem(res, req, 404, 'project-not-found', 'Project Not Found', err.message);
  } else if (err instanceof ContextTitleAlreadyExistsError) {
    problem(res, req, 409, 'context-title-already-exists', 'Context Title Already Exists', err.message);
  } else if (err instanceof ProjectTitleAlreadyExistsError) {
    problem(res, req, 409, 'project-title-already-exists', 'Project Title Already Exists', err.message);
  } else if (err instanceof InvalidTaskDescriptionError) {
    problem(res, req, 422, 'invalid-task-description', 'Invalid Task Description', err.message);
  } else if (err instanceof InvalidContextTitleError) {
    problem(res, req, 422, 'invalid-context-title', 'Invalid Context Title', err.message);
  } else if (err instanceof InvalidProjectTitleError) {
    problem(res, req, 422, 'invalid-project-title', 'Invalid Project Title', err.message);
  } else if (err instanceof ContextHasTasksError) {
    problem(res, req, 422, 'context-has-tasks', 'Context Has Tasks', err.message);
  } else if (err instanceof ProjectHasTasksError) {
    problem(res, req, 422, 'project-has-tasks', 'Project Has Tasks', err.message);
  } else if (err instanceof TaskAlreadyHasChildError) {
    problem(res, req, 422, 'task-already-has-child', 'Task Already Has Child', err.message);
  } else if (err instanceof TaskAlreadyHasParentError) {
    problem(res, req, 422, 'task-already-has-parent', 'Task Already Has Parent', err.message);
  } else if (err instanceof TaskCircularReferenceError) {
    problem(res, req, 422, 'task-circular-reference', 'Task Circular Reference', err.message);
  } else if (err instanceof TaskSelfReferenceError) {
    problem(res, req, 422, 'task-self-reference', 'Task Self Reference', err.message);
  } else if (err instanceof TaskHasNoChildError) {
    problem(res, req, 422, 'task-has-no-child', 'Task Has No Child', err.message);
  } else {
    const detail = err instanceof Error ? err.message : 'An unexpected error occurred.';
    console.error(err);
    problem(res, req, 500, 'internal-server-error', 'Internal Server Error', detail);
  }
}
