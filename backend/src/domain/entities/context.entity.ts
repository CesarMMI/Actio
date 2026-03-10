import { v4 as uuid } from 'uuid';
import { InvalidContextTitleError } from '../errors/invalid-context-title.error';

export interface ContextProps {
  readonly id: string;
  title: string;
  readonly createdAt: Date;
  updatedAt: Date;
}

export class Context {
  readonly id: string;
  title: string;
  readonly createdAt: Date;
  updatedAt: Date;

  private constructor(props: ContextProps) {
    this.id = props.id;
    this.title = props.title;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(input: { title: string }): Context {
    if (!input.title.trim()) throw new InvalidContextTitleError();
    const now = new Date();
    return new Context({
      id: uuid(),
      title: input.title,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: ContextProps): Context {
    return new Context(props);
  }

  rename(title: string): void {
    if (!title.trim()) throw new InvalidContextTitleError();
    this.title = title;
    this.updatedAt = new Date();
  }
}
