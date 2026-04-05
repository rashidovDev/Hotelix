import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  // ─── GET ALL USERS ──────────────────────────
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => [UserEntity])
  findAllUsers() {
    return this.usersService.findAll();
  }

   // ─── GET CURRENT LOGGED IN USER ──────────────
  @UseGuards(JwtGuard)
  @Query(() => UserEntity)
  me(@CurrentUser() user: any) {
    return this.usersService.findOne(user.id);
  }

  // ─── GET ONE USER ───────────────────────────
  @Query(() => UserEntity)
  findUser(@Args('id') id: string) {
    return this.usersService.findOne(id);
  }

  // ─── UPDATE USER ────────────────────────────
  @Mutation(() => UserEntity)
  updateUser(
    @Args('id') id: string,
    @Args('input') input: UpdateUserInput,
  ) {
    return this.usersService.update(id, input);
  }

  // ─── DELETE USER ────────────────────────────
  @Mutation(() => Boolean)
  removeUser(@Args('id') id: string) {
    return this.usersService.remove(id);
  }
}