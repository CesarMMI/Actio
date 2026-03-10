import { EntityProps } from "./entity.props";

export abstract class Entity {
  public readonly id: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  protected constructor(props: EntityProps) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
