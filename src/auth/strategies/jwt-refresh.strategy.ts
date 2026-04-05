import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',  // ← different name from regular jwt
) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET!,
      passReqToCallback: true,  // ← lets us access the raw token
    });
  }

  async validate(req: any, payload: { sub: string; email: string; role: string }) {
    // get the raw refresh token from header
    const rawToken = req
      .get('Authorization')
      .replace('Bearer', '')
      .trim();

    // find user
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    // compare raw token with hashed one in database
    const tokenMatches = await bcrypt.compare(
      rawToken,
      user.refreshToken,
    );

    if (!tokenMatches) {
      throw new UnauthorizedException('Access denied');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}