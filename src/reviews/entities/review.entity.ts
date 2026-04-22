import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ReviewUserEntity {
  @Field()
  id!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field({ nullable: true })
  avatar?: string;
}

@ObjectType()
export class ReviewEntity {
  @Field()
  id!: string;

  @Field()
  userId!: string;

  @Field()
  hotelId!: string;

  @Field(() => Int)
  rating!: number;

  @Field()
  comment!: string;

  @Field()
  createdAt!: Date;

  @Field(() => ReviewUserEntity, { nullable: true })
  user?: ReviewUserEntity;
}