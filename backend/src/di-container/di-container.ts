import { Injectable } from "./di-container-injectable";

export class DiContainer {
  private readonly bindings = new Map<symbol, unknown>();

  bind<T>(injectable: Injectable<T>, instance: T): void {
    this.bindings.set(injectable.token, instance);
  }

  bindMany<T>(injectable: Injectable<T[]>, instance: T): void {
    const existing = this.bindings.get(injectable.token) as T[] | undefined;
    if (existing) {
      existing.push(instance);
    } else {
      this.bindings.set(injectable.token, [instance]);
    }
  }

  resolve<T>(injectable: Injectable<T>): T {
    const instance = this.bindings.get(injectable.token);
    if (!instance)
      throw new Error(`No binding found for ${injectable.token.toString()}`);
    return instance as T;
  }
}
