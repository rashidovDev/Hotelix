import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingEntity } from './entities/booking.entity';
import { CreateBookingInput } from './dto/create-booking.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';

@Resolver(() => BookingEntity)
export class BookingsResolver {
  constructor(private bookingsService: BookingsService) {}

  // protected — must be logged in to book
  @UseGuards(JwtGuard)
  @Mutation(() => BookingEntity)
  createBooking(
    @Args('input') input: CreateBookingInput,
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.create(input, user.id);
  }

  // protected — see your own bookings
  @UseGuards(JwtGuard)
  @Query(() => [BookingEntity])
  myBookings(@CurrentUser() user: any) {
    return this.bookingsService.findMyBookings(user.id);
  }

  // protected
  @UseGuards(JwtGuard)
  @Query(() => BookingEntity)
  findBooking(
    @Args('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.findOne(id, user.id);
  }

  // protected
  @UseGuards(JwtGuard)
  @Mutation(() => BookingEntity)
  cancelBooking(
    @Args('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.cancel(id, user.id);
  }

  // protected — HOST sees bookings for their room
  @UseGuards(JwtGuard)
  @Query(() => [BookingEntity])
  roomBookings(
    @Args('roomId') roomId: string,
    @CurrentUser() user: any,
  ) {
    return this.bookingsService.findByRoom(roomId, user.id);
  }
}