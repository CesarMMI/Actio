import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService } from '../../application/interfaces/services/token-service.interface';

@Injectable()
export class JwtTokenService implements ITokenService {
  constructor(private readonly jwtService: JwtService) {}

  async signAccessToken(payload: {
    userId: string;
    email: string;
  }): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  async verifyAccessToken(
    token: string,
  ): Promise<{ userId: string; email: string }> {
    return await this.jwtService.verifyAsync(token);
  }
}
