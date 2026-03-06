export interface IUnitOfWork {
  runInTransaction<T>(fn: () => Promise<T>): Promise<T>;
}
