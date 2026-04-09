import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  firstName!: string | undefined;

  @Field({ nullable: true })
  lastName!: string | undefined;

  @Field({ nullable: true })
  email!: string | undefined;

  @Field({ nullable: true })
  avatar!: string | undefined;     
}