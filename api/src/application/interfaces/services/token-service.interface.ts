export interface ITokenService {
  signAccessToken(payload: { userId: string; email: string }): Promise<string>;
  verifyAccessToken(token: string): Promise<{ userId: string; email: string }>;
}
