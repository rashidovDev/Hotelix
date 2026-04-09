import { ObjectType, Field, Float, Int, registerEnumType } from '@nestjs/graphql';
import { RoomType } from '@prisma/client';

registerEnumType(RoomType, {
  name: 'RoomType',
  description: 'Type of room',
});

@ObjectType()
export class RoomEntity {
  @Field()
  id!: string;

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

  @Field(() => [String])
  images!: string[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}