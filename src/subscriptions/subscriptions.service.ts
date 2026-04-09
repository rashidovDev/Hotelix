import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  // ─── SUBSCRIBE TO HOTEL ──────────────────────
  async subscribe(userId: string, hotelId: string) {
    // check hotel exists
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: hotelId },
    });
    if (!hotel) throw new NotFoundException('Hotel not found');

    // check not already subscribed
    const existing = await this.prisma.hotelSubscription.findUnique({
      where: {
        userId_hotelId: { userId, hotelId },
      },
    });
    if (existing) throw new ConflictException('Already subscribed');

    return this.prisma.hotelSubscription.create({
      data: { userId, hotelId },
    });
  }

  // ─── UNSUBSCRIBE FROM HOTEL ──────────────────
  async unsubscribe(userId: string, hotelId: string) {
    const existing = await this.prisma.hotelSubscription.findUnique({
      where: {
        userId_hotelId: { userId, hotelId },
      },
    });
    if (!existing) throw new NotFoundException('Subscription not found');

    await this.prisma.hotelSubscription.delete({
      where: {
        userId_hotelId: { userId, hotelId },
      },
    });
    return true;
  }

  // ─── GET MY SUBSCRIPTIONS ────────────────────
  async mySubscriptions(userId: string) {
    return this.prisma.hotelSubscription.findMany({
      where: { userId },
      include: {
        hotel: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── GET SUBSCRIBERS FOR HOTEL ───────────────
  async getSubscribers(hotelId: string) {
    return this.prisma.hotelSubscription.findMany({
      where: { hotelId },
      include: { user: true },
    });
  }

  // ─── CHECK IF SUBSCRIBED ─────────────────────
  async isSubscribed(userId: string, hotelId: string) {
    const existing = await this.prisma.hotelSubscription.findUnique({
      where: {
        userId_hotelId: { userId, hotelId },
      },
    });
    return !!existing;
  }
}