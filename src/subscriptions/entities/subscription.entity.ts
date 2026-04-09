import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SubscriptionEntity {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  hotelId: string;

  @Field()
  createdAt: Date;
}