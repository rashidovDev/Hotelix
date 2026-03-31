import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,   // ← register the strategy
  ],
  exports: [JwtStrategy],
})
export class AuthModule {}