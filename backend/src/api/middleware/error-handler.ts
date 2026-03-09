import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../domain/errors';

const NOT_FOUND_ERRORS = new Set([
  'ActionNotFoundError',
  'CapturedItemNotFoundError',
  'ProjectNotFoundError',
  'ContextNotFoundError',
]);

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof DomainError) {
    res.status(422).json({ error: err.message });
    return;
  }

  if (NOT_FOUND_ERRORS.has(err.constructor.name)) {
    res.status(404).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}
