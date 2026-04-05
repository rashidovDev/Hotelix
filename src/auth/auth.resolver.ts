import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './entities/auth.entity';
import { RegisterInput } from './dto/register.dto';
import { LoginInput } from './dto/login.dto';
import { UseGuards } from '@nestjs/common';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtGuard } from './guards/jwt.guard';
import { CurrentUser } from './decorator/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => AuthResponse)
  login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  } 

   // ─── REFRESH TOKENS ──────────────────────────
  // send refreshToken in Authorization header here
  @UseGuards(JwtRefreshGuard)
  @Mutation(() => AuthResponse)
  refreshTokens(@CurrentUser() user: any) {
    return this.authService.refreshTokens(
      user.id,
      user.email,
      user.role,
    );
  }

  // ─── LOGOUT ──────────────────────────────────
  @UseGuards(JwtGuard)
  @Mutation(() => Boolean)
  logout(@CurrentUser() user: any) {
    return this.authService.logout(user.id);
  }
}