export class BusinessRuleViolationError extends Error {
  constructor(message: string, readonly metadata?: Record<string, unknown>) {
    super(message);
    this.name = 'BusinessRuleViolationError';
  }
}
