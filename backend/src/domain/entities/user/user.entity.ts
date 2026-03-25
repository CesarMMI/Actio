import { v4 as uuid } from "uuid";
import { Email } from "../../value-objects/email/email.value-object";
import { Entity } from "../entity/entity";
import { UserProps, UserRole } from "./user.props";

export class User extends Entity {
  email: Email;
  passwordHash: string;
  role: UserRole;
  name?: string;

  private constructor(props: UserProps) {
    super(props);
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.role = props.role;
    this.name = props.name;
  }

  static create(input: Pick<UserProps, 'email' | 'passwordHash' | 'role' | 'name'>): User {
    const now = new Date();
    return new User({
      id: uuid(),
      email: input.email,
      passwordHash: input.passwordHash,
      role: input.role ?? "default",
      name: input.name,
      createdAt: now,
      updatedAt: now,
    });
  }

  static load(props: UserProps): User {
    return new User(props);
  }

  changePassword(newHash: string): void {
    this.passwordHash = newHash;
    this.updatedAt = new Date();
  }
}
