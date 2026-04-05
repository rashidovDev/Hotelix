import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

// ← custom extractor reads from cookie
const cookieExtractor = (req: any): string | null => {
  // console.log('🍪 All cookies:', req?.cookies);        // ← debug
  // console.log('🔑 RefreshToken cookie:', req?.cookies?.refreshToken); // ← debug
  return req?.cookies?.refreshToken ?? null;
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
   Strategy,
  'jwt-refresh',
) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: cookieExtractor,  // ← from cookie now
      secretOrKey: process.env.JWT_REFRESH_SECRET!,
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    payload: { sub: string; email: string; role: string },
  ) {
    // get raw token from cookie
    const rawToken = req.cookies?.refreshToken;

    if (!rawToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    // compare cookie token with hashed one in database
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

