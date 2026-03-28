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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  // ─── REGISTER ───────────────────────────────
  async register(input: RegisterInput) {
    // 1. Check if email already exists
    const exists = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (exists) throw new ConflictException('Email already in use');

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(input.password, 10);

    // 3. Create user in database
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        firstName: input.firstName,
        lastName: input.lastName,
      },
    });

    // 4. Return tokens
    return this.generateTokens(user.id, user.email, user.role);
  }

  // ─── LOGIN ──────────────────────────────────
  async login(input: LoginInput) {
    // 1. Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // 2. Check password matches
    const passwordMatch = await bcrypt.compare(input.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    // 3. Return tokens
    return this.generateTokens(user.id, user.email, user.role);
  }

  // ─── GENERATE TOKENS ────────────────────────
  async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    // Short lived — 15 minutes
    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    // Long lived — 7 days
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    // Save hashed refresh token to DB
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: await bcrypt.hash(refreshToken, 10),
      },
    });

    return { accessToken, refreshToken };
  }
}