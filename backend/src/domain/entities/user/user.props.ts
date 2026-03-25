import { Email } from "../../value-objects/email/email.value-object";
import { EntityProps } from "../entity/entity.props";

export type UserRole = "default" | "admin";

export type UserProps = EntityProps & {
  email: Email;
  passwordHash: string;
  role: UserRole;
  name?: string;
};
