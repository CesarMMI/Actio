export const IClock = Symbol('IClock');

export interface IClock {
  now(): Date;
}
