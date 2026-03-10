import { v4 as uuid } from "uuid";
import { InvalidContextTitleError } from "../../errors/context/invalid-context-title.error";
import { Entity } from "../entity/entity";
import { ContextProps } from "./context.props";

export class Context extends Entity {
  title: string;

  private constructor(props: ContextProps) {
    super(props);
    this.title = props.title;
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

  static load(props: ContextProps): Context {
    return new Context(props);
  }

  rename(title: string): void {
    if (!title.trim()) throw new InvalidContextTitleError();
    this.title = title;
    this.updatedAt = new Date();
  }
}
