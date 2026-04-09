import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { RoomType } from '@prisma/client';

@InputType()
export class CreateRoomInput {
  @Field()
  hotelId!: string;

  @Field()
  name!: string;

  @Field(() => RoomType)
  type!: RoomType;

  @Field(() => Float)
  price!: number;

  @Field(() => Int)
  capacity!: number;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  images?: string[];
}