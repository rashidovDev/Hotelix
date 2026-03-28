import { ObjectType, Field, Float, registerEnumType } from '@nestjs/graphql';
import { BookingStatus } from '@prisma/client';

registerEnumType(BookingStatus, {
  name: 'BookingStatus',
  description: 'Status of a booking',
});

@ObjectType()
export class BookingEntity {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  roomId: string;

  @Field()
  checkIn: Date;

  @Field()
  checkOut: Date;

  @Field(() => Float)
  totalPrice: number;

  @Field(() => BookingStatus)
  status: BookingStatus;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}