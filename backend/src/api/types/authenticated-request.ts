import { Request } from "express";
import { UserRole } from "../../domain/entities/user/user.props";

export interface AuthPayload {
  userId: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  auth: AuthPayload;
}
