import { NextFunction, Request, Response, Router } from "express";
import { ILoginUseCase } from "../../application/interfaces/auth/login.use-case.interface";
import { ILogoutUseCase } from "../../application/interfaces/auth/logout.use-case.interface";
import { IMeUseCase } from "../../application/interfaces/auth/me.use-case.interface";
import { IRefreshUseCase } from "../../application/interfaces/auth/refresh.use-case.interface";
import { IRegisterUseCase } from "../../application/interfaces/auth/register.use-case.interface";
import { ITokenService } from "../../application/interfaces/token-service.interface";
import { createAuthenticateMiddleware } from "../middleware/authenticate.middleware";
import { IController } from "../interfaces/controller.interface";
import { AuthenticatedRequest } from "../types/authenticated-request";

export class AuthController implements IController {
  readonly basePath = "/auth";

  private readonly authenticate: ReturnType<typeof createAuthenticateMiddleware>;

  constructor(
    private readonly register: IRegisterUseCase,
    private readonly login: ILoginUseCase,
    private readonly refresh: IRefreshUseCase,
    private readonly me: IMeUseCase,
    private readonly logout: ILogoutUseCase,
    tokenService: ITokenService,
  ) {
    this.authenticate = createAuthenticateMiddleware(tokenService);
  }

  registerRoutes(router: Router): void {
    router.post("/register", this.handleRegister.bind(this));
    router.post("/login", this.handleLogin.bind(this));
    router.post("/refresh", this.handleRefresh.bind(this));
    router.get("/me", this.authenticate, this.handleMe.bind(this));
    router.post("/logout", this.authenticate, this.handleLogout.bind(this));
  }

  // UC-A01: Register
  private async handleRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name, deviceId } = req.body;
      res.status(201).json(await this.register.execute({ email, password, name, deviceId }));
    } catch (err) {
      next(err);
    }
  }

  // UC-A02: Login
  private async handleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, deviceId } = req.body;
      res.json(await this.login.execute({ email, password, deviceId }));
    } catch (err) {
      next(err);
    }
  }

  // UC-A03: Refresh Tokens
  private async handleRefresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      res.json(await this.refresh.execute({ refreshToken }));
    } catch (err) {
      next(err);
    }
  }

  // UC-A04: Get Current User
  private async handleMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = (req as AuthenticatedRequest).auth;
      res.json(await this.me.execute({ userId }));
    } catch (err) {
      next(err);
    }
  }

  // UC-A05: Logout
  private async handleLogout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      await this.logout.execute({ refreshToken });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
