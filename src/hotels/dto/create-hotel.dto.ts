import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateHotelInput {
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

  @Field(() => [String], { nullable: true })
  amenities?: string[];

  @Field(() => [String], { nullable: true })
  images?: string[];
}