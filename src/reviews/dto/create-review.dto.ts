import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
  @Field()
  hotelId: string;

  @Field(() => Int)
  rating: number;

  @Field()
  comment: string;
}