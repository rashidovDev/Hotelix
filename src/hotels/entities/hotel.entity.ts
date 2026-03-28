import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class HotelEntity {
  @Field()
  id: string;

  @Field()
  ownerId: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  location: string;

  @Field()
  city: string;

  @Field()
  country: string;

  @Field(() => [String])
  amenities: string[];

  @Field(() => [String])
  images: string[];

  @Field(() => Float, { nullable: true })
  rating?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}