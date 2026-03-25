import { UserRole } from "../../../../domain/entities/user/user.props";

export type MeOutput = {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: Date;
};
