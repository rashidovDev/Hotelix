import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './entities/auth.entity';
import { RegisterInput } from './dto/register.dto';
import { LoginInput } from './dto/login.dto';

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
}