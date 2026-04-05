import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterInput } from './dto/register.dto';
import { LoginInput } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  // ─── REGISTER ───────────────────────────────
  async register(input: RegisterInput, res: Response) {
    const exists = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (exists) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        firstName: input.firstName,
        lastName: input.lastName,
      },
    });

    return this.generateTokens(user.id, user.email, user.role, res);
  }

  // ─── LOGIN ──────────────────────────────────
  async login(input: LoginInput, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(
      input.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.email, user.role, res);
  }

  // ─── REFRESH TOKENS ─────────────────────────
  async refreshTokens(
    userId: string,
    email: string,
    role: string,
    res: Response,
  ) {
    return this.generateTokens(userId, email, role, res);
  }

  // ─── LOGOUT ─────────────────────────────────
  async logout(userId: string, res: Response) {
    // 1. wipe refresh token from database
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    // 2. clear the cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return true;
  }

  // ─── GENERATE TOKENS ────────────────────────
  async generateTokens(
    userId: string,
    email: string,
    role: string,
    res: Response,
  ) {
    const payload = { sub: userId, email, role };

    // short lived — 15 minutes
    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    // long lived — 7 days
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    // save hashed refresh token to database
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: await bcrypt.hash(refreshToken, 10),
      },
    });

    // ✅ set refreshToken as HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,                                      // JS cannot access
      secure: process.env.NODE_ENV === 'production',      // HTTPS only in prod
      sameSite: 'strict',                                  // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000,                   // 7 days in ms
      path: '/',                                    // only sent to /graphql
    });

    // fetch user without sensitive fields
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
        refreshToken: false,
      },
    });

    // only accessToken returned in body
    // refreshToken is in the cookie
    return { accessToken, user };
  }
}