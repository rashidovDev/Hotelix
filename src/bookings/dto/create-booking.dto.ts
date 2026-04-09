import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateBookingInput {
  @Field()
  roomId!: string;

  @Field()
  checkIn!: Date;

  @Field()
  checkOut!: Date;

  @Field(() => Int)
  guests!: number;       // ← add guests count
}