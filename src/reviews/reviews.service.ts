import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewInput } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  // ─── CREATE REVIEW ───────────────────────────
  async create(input: CreateReviewInput, userId: string) {
    // 1. Validate rating is between 1 and 5
    if (input.rating < 1 || input.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // 2. Check hotel exists
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: input.hotelId },
    });
    if (!hotel) throw new NotFoundException('Hotel not found');

    // 3. Check user has not already reviewed this hotel
    const alreadyReviewed = await this.prisma.review.findFirst({
      where: {
        userId,
        hotelId: input.hotelId,
      },
    });

    if (alreadyReviewed) {
      throw new BadRequestException(
        'You have already reviewed this hotel',
      );
    }

    // 4. Create the review
    const review = await this.prisma.review.create({
      data: {
        userId,
        hotelId: input.hotelId,
        rating: input.rating,
        comment: input.comment,
      },
    });

    // 5. Update hotel average rating
    await this.updateHotelRating(input.hotelId);

    return review;
  }

  // ─── GET ALL REVIEWS FOR A HOTEL ─────────────
  async findByHotel(hotelId: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: hotelId },
    });
    if (!hotel) throw new NotFoundException('Hotel not found');

    return this.prisma.review.findMany({
      where: { hotelId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  }

  // ─── GET MY REVIEWS ──────────────────────────
  async findMyReviews(userId: string) {
    return this.prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
    });
  }

  // ─── DELETE REVIEW ───────────────────────────
  async remove(id: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) throw new NotFoundException('Review not found');

    // only the author can delete their review
    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.prisma.review.delete({ where: { id } });

    // recalculate hotel rating after deletion
    await this.updateHotelRating(review.hotelId);

    return true;
  }

  // ─── UPDATE HOTEL AVERAGE RATING ─────────────
  private async updateHotelRating(hotelId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { hotelId },
      select: { rating: true },
    });

    // calculate average
    const avgRating =
      reviews.length === 0
        ? 0
        : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    // update hotel rating
    await this.prisma.hotel.update({
      where: { id: hotelId },
      data: { rating: Math.round(avgRating * 10) / 10 }, // round to 1 decimal
    });
  }
}