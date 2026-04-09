import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingGateway } from '../gateway/gateway.gateway';
import { CreateBookingInput } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private gateway: BookingGateway,  // ← inject gateway
  ) {}

  // ─── CREATE BOOKING ──────────────────────────
async create(input: CreateBookingInput, userId: string) {
  const { roomId, checkIn, checkOut, guests } = input;

  // 1. Validate dates
  if (checkIn >= checkOut) {
    throw new BadRequestException('Check-in must be before check-out');
  }
  if (checkIn < new Date()) {
    throw new BadRequestException('Check-in cannot be in the past');
  }

  return this.prisma.$transaction(async (tx) => {
    // 2. Find room
    const room = await tx.room.findUnique({
      where: { id: roomId },
      include: { hotel: true },
    });
    if (!room) throw new NotFoundException('Room not found');

    // 3. Check guests does not exceed capacity
    if (guests > room.capacity) {
      throw new BadRequestException(
        `This room fits maximum ${room.capacity} guests`,
      );
    }

    // 4. Check availability
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
    if (conflict) {
      throw new ConflictException('Room is already booked for these dates');
    }

    // 5. Calculate price summary
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) /
      (1000 * 60 * 60 * 24),
    );
    const pricePerNight = Number(room.price);
    const totalPrice = pricePerNight * nights;

    // 6. Build price summary
    const priceSummary = {
      roomName: room.name,
      guests,
      checkIn,
      checkOut,
      nights,
      pricePerNight,
      totalPrice,
    };

    // 7. Create booking
    const booking = await tx.booking.create({
      data: {
        userId,
        roomId,
        checkIn,
        checkOut,
        guests,
        totalPrice,
        status: 'CONFIRMED',
      },
    });

    // 8. Notify hotel subscribers
    this.gateway.notifyRoomBooked(room.hotel.id, roomId);

    // 9. Return booking with price summary
    return { ...booking, priceSummary };
  });
}

  // ─── CANCEL BOOKING ──────────────────────────
  async cancel(id: string, userId: string) {
    const booking = await this.findOne(id, userId);

    if (booking.status === 'CANCELLED') {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.checkIn < new Date()) {
      throw new BadRequestException(
        'Cannot cancel a booking that has already started',
      );
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        room: {
          include: { hotel: true },
        },
      },
    });

    // emit real-time event ──────────────────────
    this.gateway.notifyRoomAvailable(
      updated.room.hotel.id,
      updated.roomId,
    );

    return updated;
  }

  // ─── GET MY BOOKINGS ─────────────────────────
  async findMyBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        room: {
          include: { hotel: true },
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

    if (booking.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return booking;
  }

  // ─── GET BOOKINGS FOR A ROOM ─────────────────
  async findByRoom(roomId: string, userId: string) {
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