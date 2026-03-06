export class InvalidStatusTransitionError extends Error {
  constructor(
    readonly entity: string,
    readonly previousStatus: string,
    readonly newStatus: string
  ) {
    super(`Invalid status transition for ${entity}: ${previousStatus} -> ${newStatus}`);
    this.name = 'InvalidStatusTransitionError';
  }
}
