import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { RoomType } from '@prisma/client';

@InputType()
export class UpdateRoomInput {
  @Field({ nullable: true })
  name!: string | undefined;

  @Field(() => RoomType, { nullable: true })
  type!: RoomType | undefined;

  @Field(() => Float, { nullable: true })
  price!: number | undefined;

  @Field(() => Int, { nullable: true })
  capacity!: number | undefined;

  @Field({ nullable: true })
  description!: string | undefined;

  @Field(() => [String], { nullable: true })
  images!: string[] | undefined;
}