import { ObjectType, Field, Float, Int, registerEnumType } from '@nestjs/graphql';
import { BookingStatus } from '@prisma/client';

registerEnumType(BookingStatus, {
  name: 'BookingStatus',
  description: 'Status of a booking',
});

// ─── PRICE SUMMARY ───────────────────────────
@ObjectType()
export class PriceSummary {
  @Field()
  roomName!: string;        // ← add !

  @Field(() => Int)
  guests!: number;          // ← add !

  @Field()
  checkIn!: Date;           // ← add !

  @Field()
  checkOut!: Date;          // ← add !

  @Field(() => Int)
  nights!: number;          // ← add !

  @Field(() => Float)
  pricePerNight!: number;   // ← add !

  @Field(() => Float)
  totalPrice!: number;      // ← add !
}

// ─── BOOKING ENTITY ──────────────────────────
@ObjectType()
export class BookingEntity {
  @Field()
  id!: string;              // ← add !

  @Field()
  userId!: string;          // ← add !

  @Field()
  roomId!: string;          // ← add !

  @Field()
  checkIn!: Date;           // ← add !

  @Field()
  checkOut!: Date;          // ← add !

  @Field(() => Int)
  guests!: number;          // ← add !

  @Field(() => Float)
  totalPrice!: number;      // ← add !

  @Field(() => BookingStatus)
  status!: BookingStatus;   // ← add !

  @Field(() => PriceSummary, { nullable: true })
  priceSummary?: PriceSummary;

  @Field()
  createdAt!: Date;         // ← add !

  @Field()
  updatedAt!: Date;         // ← add !
}