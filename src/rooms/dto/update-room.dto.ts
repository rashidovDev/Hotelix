import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { RoomType } from '@prisma/client';

@InputType()
export class UpdateRoomInput {
  @Field({ nullable: true })
  name?: string;

  @Field(() => RoomType, { nullable: true })
  type?: RoomType;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => Int, { nullable: true })
  capacity?: number;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  images?: string[];
}