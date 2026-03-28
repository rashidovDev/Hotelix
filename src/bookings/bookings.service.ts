import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingInput } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  // ─── CREATE BOOKING ──────────────────────────
  async create(input: CreateBookingInput, userId: string) {
    const { roomId, checkIn, checkOut } = input;

    // 1. Validate dates
    if (checkIn >= checkOut) {
      throw new BadRequestException('Check-in must be before check-out');
    }

    if (checkIn < new Date()) {
      throw new BadRequestException('Check-in cannot be in the past');
    }

    // 2. Use transaction to prevent double booking
    return this.prisma.$transaction(async (tx) => {
      // 3. Find the room
      const room = await tx.room.findUnique({
        where: { id: roomId },
      });
      if (!room) throw new NotFoundException('Room not found');

      // 4. Check for conflicting bookings
      const conflict = await tx.booking.findFirst({
        where: {
          roomId,
          status: { not: 'CANCELLED' },
          AND: [
            { checkIn: { lt: checkOut } },
            { checkOut: { gt: checkIn } },
          ],
        },
      });

      // 5. If conflict found throw error
      if (conflict) {
        throw new ConflictException(
          'Room is already booked for these dates',
        );
      }

      // 6. Calculate total price
      const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) /
        (1000 * 60 * 60 * 24),
      );
      const totalPrice = Number(room.price) * nights;

      // 7. Create the booking
      return tx.booking.create({
        data: {
          userId,
          roomId,
          checkIn,
          checkOut,
          totalPrice,
          status: 'CONFIRMED',
        },
      });
    });
  }

  // ─── GET MY BOOKINGS ─────────────────────────
  async findMyBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        room: {
          include: {
            hotel: true,  // include hotel info inside room
          },
        },
      },
    });
  }

  // ─── GET ONE BOOKING ─────────────────────────
  async findOne(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        room: {
          include: { hotel: true },
        },
      },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    // users can only see their own bookings
    if (booking.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return booking;
  }

  // ─── CANCEL BOOKING ──────────────────────────
  async cancel(id: string, userId: string) {
    const booking = await this.findOne(id, userId);

    // cannot cancel already cancelled booking
    if (booking.status === 'CANCELLED') {
      throw new BadRequestException('Booking is already cancelled');
    }

    // cannot cancel past bookings
    if (booking.checkIn < new Date()) {
      throw new BadRequestException(
        'Cannot cancel a booking that has already started',
      );
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  // ─── GET ALL BOOKINGS FOR A ROOM (HOST) ──────
  async findByRoom(roomId: string, userId: string) {
    // make sure the user owns the hotel this room belongs to
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: { hotel: true },
    });

    if (!room) throw new NotFoundException('Room not found');

    if (room.hotel.ownerId !== userId) {
      throw new ForbiddenException('You do not own this room');
    }

    return this.prisma.booking.findMany({
      where: { roomId },
      orderBy: { checkIn: 'asc' },
      include: { room: true },
    });
  }
}