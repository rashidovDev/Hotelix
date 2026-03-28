import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.dto';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  // ─── GET ALL USERS ──────────────────────────
  @Query(() => [UserEntity])
  findAllUsers() {
    return this.usersService.findAll();
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