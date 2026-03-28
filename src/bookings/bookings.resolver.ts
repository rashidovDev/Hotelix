import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BookingsService } from './bookings.service';
import { BookingEntity } from './entities/booking.entity';
import { CreateBookingInput } from './dto/create-booking.dto';

@Resolver(() => BookingEntity)
export class BookingsResolver {
  constructor(private bookingsService: BookingsService) {}

  // ─── CREATE BOOKING ──────────────────────────
  @Mutation(() => BookingEntity)
  createBooking(
    @Args('input') input: CreateBookingInput,
    @Args('userId') userId: string, // temporary — later from JWT
  ) {
    return this.bookingsService.create(input, userId);
  }

  // ─── GET MY BOOKINGS ─────────────────────────
  @Query(() => [BookingEntity])
  myBookings(
    @Args('userId') userId: string, // temporary — later from JWT
  ) {
    return this.bookingsService.findMyBookings(userId);
  }

  // ─── GET ONE BOOKING ─────────────────────────
  @Query(() => BookingEntity)
  findBooking(
    @Args('id') id: string,
    @Args('userId') userId: string, // temporary — later from JWT
  ) {
    return this.bookingsService.findOne(id, userId);
  }

  // ─── CANCEL BOOKING ──────────────────────────
  @Mutation(() => BookingEntity)
  cancelBooking(
    @Args('id') id: string,
    @Args('userId') userId: string, // temporary — later from JWT
  ) {
    return this.bookingsService.cancel(id, userId);
  }

  // ─── GET BOOKINGS FOR A ROOM ─────────────────
  @Query(() => [BookingEntity])
  roomBookings(
    @Args('roomId') roomId: string,
    @Args('userId') userId: string, // temporary — later from JWT
  ) {
    return this.bookingsService.findByRoom(roomId, userId);
  }
}