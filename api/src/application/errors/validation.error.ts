export class ValidationError extends Error {
  constructor(
    message = 'Validation failed.',
    readonly errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
