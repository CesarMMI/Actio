import { NextFunction, Request, Response } from "express";
import { ContextHasTasksError } from "../../domain/errors/context/context-has-tasks.error";
import { ContextNotFoundError } from "../../domain/errors/context/context-not-found.error";
import { ContextTitleAlreadyExistsError } from "../../domain/errors/context/context-title-already-exists.error";
import { InvalidContextTitleError } from "../../domain/errors/context/invalid-context-title.error";
import { InvalidProjectTitleError } from "../../domain/errors/project/invalid-project-title.error";
import { ProjectHasTasksError } from "../../domain/errors/project/project-has-tasks.error";
import { ProjectNotFoundError } from "../../domain/errors/project/project-not-found.error";
import { ProjectTitleAlreadyExistsError } from "../../domain/errors/project/project-title-already-exists.error";
import { InvalidTaskDescriptionError } from "../../domain/errors/task/invalid-task-description.error";
import { TaskAlreadyDoneError } from "../../domain/errors/task/task-already-done.error";
import { TaskNotDoneError } from "../../domain/errors/task/task-not-done.error";
import { TaskNotFoundError } from "../../domain/errors/task/task-not-found.error";

const BASE = "https://actio.app/errors";

function problem(
  res: Response,
  req: Request,
  status: number,
  slug: string,
  title: string,
  detail: string,
): void {
  res.status(status).json({
    type: `${BASE}/${slug}`,
    title,
    status,
    detail,
    instance: req.path,
  });
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof TaskAlreadyDoneError) {
    problem(
      res,
      req,
      422,
      "task-already-done",
      "Task Already Done",
      err.message,
    );
  } else if (err instanceof TaskNotDoneError) {
    problem(res, req, 422, "task-not-done", "Task Not Done", err.message);
  } else if (err instanceof TaskNotFoundError) {
    problem(res, req, 404, "task-not-found", "Task Not Found", err.message);
  } else if (err instanceof ContextNotFoundError) {
    problem(
      res,
      req,
      404,
      "context-not-found",
      "Context Not Found",
      err.message,
    );
  } else if (err instanceof ProjectNotFoundError) {
    problem(
      res,
      req,
      404,
      "project-not-found",
      "Project Not Found",
      err.message,
    );
  } else if (err instanceof ContextTitleAlreadyExistsError) {
    problem(
      res,
      req,
      409,
      "context-title-already-exists",
      "Context Title Already Exists",
      err.message,
    );
  } else if (err instanceof ProjectTitleAlreadyExistsError) {
    problem(
      res,
      req,
      409,
      "project-title-already-exists",
      "Project Title Already Exists",
      err.message,
    );
  } else if (err instanceof InvalidTaskDescriptionError) {
    problem(
      res,
      req,
      422,
      "invalid-task-description",
      "Invalid Task Description",
      err.message,
    );
  } else if (err instanceof InvalidContextTitleError) {
    problem(
      res,
      req,
      422,
      "invalid-context-title",
      "Invalid Context Title",
      err.message,
    );
  } else if (err instanceof InvalidProjectTitleError) {
    problem(
      res,
      req,
      422,
      "invalid-project-title",
      "Invalid Project Title",
      err.message,
    );
  } else if (err instanceof ContextHasTasksError) {
    problem(
      res,
      req,
      422,
      "context-has-tasks",
      "Context Has Tasks",
      err.message,
    );
  } else if (err instanceof ProjectHasTasksError) {
    problem(
      res,
      req,
      422,
      "project-has-tasks",
      "Project Has Tasks",
      err.message,
    );
  } else {
    const detail =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(err);
    problem(
      res,
      req,
      500,
      "internal-server-error",
      "Internal Server Error",
      detail,
    );
  }
}
