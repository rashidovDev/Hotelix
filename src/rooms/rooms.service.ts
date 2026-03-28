import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomInput } from './dto/create-room.dto';
import { UpdateRoomInput } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  // ─── CREATE ROOM ─────────────────────────────
  async create(input: CreateRoomInput, userId: string) {
    // make sure the hotel exists and belongs to this user
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: input.hotelId },
    });

    if (!hotel) throw new NotFoundException('Hotel not found');

    if (hotel.ownerId !== userId) {
      throw new ForbiddenException('You do not own this hotel');
    }

    return this.prisma.room.create({
      data: {
        ...input,
        images: input.images ?? [],
      },
    });
  }

  // ─── GET ALL ROOMS FOR A HOTEL ───────────────
  async findByHotel(hotelId: string) {
    return this.prisma.room.findMany({
      where: { hotelId },
      orderBy: { price: 'asc' },
    });
  }

  // ─── GET ONE ROOM ────────────────────────────
  async findOne(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        hotel: true,      // include hotel info
        bookings: true,   // include bookings
      },
    });

    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  // ─── UPDATE ROOM ─────────────────────────────
  async update(id: string, input: UpdateRoomInput, userId: string) {
    const room = await this.findOne(id);

    // check the user owns the hotel this room belongs to
    if (room.hotel.ownerId !== userId) {
      throw new ForbiddenException('You do not own this room');
    }

    return this.prisma.room.update({
      where: { id },
      data: { ...input },
    });
  }

  // ─── DELETE ROOM ─────────────────────────────
  async remove(id: string, userId: string) {
    const room = await this.findOne(id);

    // check the user owns the hotel this room belongs to
    if (room.hotel.ownerId !== userId) {
      throw new ForbiddenException('You do not own this room');
    }

    await this.prisma.room.delete({ where: { id } });
    return true;
  }

  // ─── CHECK AVAILABILITY ──────────────────────
  async checkAvailability(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
  ) {
    const conflict = await this.prisma.booking.findFirst({
      where: {
        roomId,
        status: { not: 'CANCELLED' },
        AND: [
          { checkIn: { lt: checkOut } },
          { checkOut: { gt: checkIn } },
        ],
      },
    });

    return conflict === null; // true = available, false = taken
  }
}