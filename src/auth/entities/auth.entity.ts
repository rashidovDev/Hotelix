import { ObjectType, Field } from '@nestjs/graphql';
import { UserEntity } from 'src/users/entities/user.entity';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken!: string;

  @Field(() => UserEntity)  //  user data
  user!: UserEntity;
}