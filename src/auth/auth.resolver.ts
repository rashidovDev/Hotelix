import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponse } from './entities/auth.entity';
import { RegisterInput } from './dto/register.dto';
import { LoginInput } from './dto/login.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtGuard } from './guards/jwt.guard';
import { Response } from 'express';
import { CurrentUser } from './decorator/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  // ─── REGISTER ────────────────────────────────
  @Mutation(() => AuthResponse)
  register(
    @Args('input') input: RegisterInput,
    @Context() context: { res: Response },  // ← get res from context
  ) {
    return this.authService.register(input, context.res);
  }

  // ─── LOGIN ───────────────────────────────────
  @Mutation(() => AuthResponse)
  login(
    @Args('input') input: LoginInput,
    @Context() context: { res: Response },
  ) {
    return this.authService.login(input, context.res);
  }

  // ─── REFRESH TOKENS ──────────────────────────
  // refreshToken is read automatically from cookie
  @UseGuards(JwtRefreshGuard)
  @Mutation(() => AuthResponse)
  refreshTokens(
    @CurrentUser() user: any,
    @Context() context: { res: Response },
  ) {
    return this.authService.refreshTokens(
      user.id,
      user.email,
      user.role,
      context.res,
    );
  }

  // ─── LOGOUT ──────────────────────────────────
  @UseGuards(JwtGuard)
  @Mutation(() => Boolean)
  logout(
    @CurrentUser() user: any,
    @Context() context: { res: Response },
  ) {
    return this.authService.logout(user.id, context.res);
  }
}