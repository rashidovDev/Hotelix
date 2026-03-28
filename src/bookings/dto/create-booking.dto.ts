import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateBookingInput {
  @Field()
  roomId: string;

  @Field()
  checkIn: Date;

  @Field()
  checkOut: Date;
}