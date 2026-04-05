import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHotelInput } from './dto/create-hotel.dto';
import { UpdateHotelInput } from './dto/update-hotel.dto';

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  // ─── CREATE HOTEL ────────────────────────────
  async create(input: CreateHotelInput, ownerId: string) {
    return this.prisma.hotel.create({
      data: {
        ...input,
        ownerId,
        amenities: input.amenities ?? [],
        images: input.images ?? [], 
      },
    });
  }

  // ─── GET ALL HOTELS ──────────────────────────
  async findAll() {
    return this.prisma.hotel.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── SEARCH HOTELS ───────────────────────────
  async search(city?: string, country?: string) {
    return this.prisma.hotel.findMany({
      where: {
        ...(city && {
          city: { contains: city, mode: 'insensitive' },
        }),
        ...(country && {
          country: { contains: country, mode: 'insensitive' },
        }),
      },
      orderBy: { rating: 'desc' },
    });
  }

  // ─── GET ONE HOTEL ───────────────────────────
  async findOne(id: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id },
      include: {
        rooms: true,    // include rooms
        reviews: true,  // include reviews
      },
    });

    if (!hotel) throw new NotFoundException('Hotel not found');
    return hotel;
  }

  // ─── UPDATE HOTEL ────────────────────────────
  async update(id: string, input: UpdateHotelInput, userId: string) {
    const hotel = await this.findOne(id);

    // only the owner can update
    if (hotel.ownerId !== userId) {
      throw new ForbiddenException('You do not own this hotel');
    }

    return this.prisma.hotel.update({
      where: { id },
      data: { ...input },
    });
  }

  // ─── DELETE HOTEL ────────────────────────────
  async remove(id: string, userId: string) {
    const hotel = await this.findOne(id);

    // only the owner can delete
    if (hotel.ownerId !== userId) {
      throw new ForbiddenException('You do not own this hotel');
    }

    await this.prisma.hotel.delete({ where: { id } });
    return true;
  }

  // ─── GET MY HOTELS (for HOST) ────────────────
  async findMyHotels(ownerId: string) {
    return this.prisma.hotel.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });
  }
}