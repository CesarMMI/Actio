import { ContextAlreadyActiveError, ContextNotActiveError } from '../errors';

export interface ContextProps {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: Date;
}

export class Context {
  readonly id: string;
  name: string;
  description?: string;
  active: boolean;
  readonly createdAt: Date;

  constructor(props: ContextProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.active = props.active;
    this.createdAt = props.createdAt;
  }

  rename(name: string): void {
    this.name = name;
  }

  activate(): void {
    if (this.active) {
      throw new ContextAlreadyActiveError(this.id);
    }
    this.active = true;
  }

  deactivate(): void {
    if (!this.active) {
      throw new ContextNotActiveError(this.id);
    }
    this.active = false;
  }
}
