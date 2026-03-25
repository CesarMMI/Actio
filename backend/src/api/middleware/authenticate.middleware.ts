import { NextFunction, Request, Response } from "express";
import { ITokenService } from "../../application/interfaces/token-service.interface";
import { UnauthorizedError } from "../../domain/errors/auth/unauthorized.error";
import { AuthenticatedRequest } from "../types/authenticated-request";

export function createAuthenticateMiddleware(
  tokenService: ITokenService,
) {
  return function authenticate(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new UnauthorizedError());
    }

    const token = authHeader.slice(7);
    try {
      const payload = tokenService.verifyAccessToken(token);
      (req as AuthenticatedRequest).auth = {
        userId: payload.sub,
        role: payload.role,
      };
      next();
    } catch {
      next(new UnauthorizedError());
    }
  };
}
