import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateHotelInput {
  @Field({ nullable: true })
  name!: string | undefined;

  @Field({ nullable: true })
  description!: string | undefined;

  @Field({ nullable: true })
  location!: string | undefined;

  @Field({ nullable: true })
  city!: string | undefined;

  @Field({ nullable: true })
  country!: string | undefined;

  @Field(() => [String], { nullable: true })
  amenities!: string[] | undefined;

  @Field(() => [String], { nullable: true })
  images!: string[] | undefined;
}