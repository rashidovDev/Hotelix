import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ReviewEntity {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  hotelId: string;

  @Field(() => Int)
  rating: number;

  @Field()
  comment: string;

  @Field()
  createdAt: Date;
}