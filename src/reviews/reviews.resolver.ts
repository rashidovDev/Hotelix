import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { ReviewEntity } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.dto';

@Resolver(() => ReviewEntity)
export class ReviewsResolver {
  constructor(private reviewsService: ReviewsService) {}

  // ─── CREATE REVIEW ───────────────────────────
  @Mutation(() => ReviewEntity)
  createReview(
    @Args('input') input: CreateReviewInput,
    @Args('userId') userId: string, // temporary — later from JWT
  ) {
    return this.reviewsService.create(input, userId);
  }

  // ─── GET REVIEWS FOR A HOTEL ─────────────────
  @Query(() => [ReviewEntity])
  hotelReviews(@Args('hotelId') hotelId: string) {
    return this.reviewsService.findByHotel(hotelId);
  }

  // ─── GET MY REVIEWS ──────────────────────────
  @Query(() => [ReviewEntity])
  myReviews(
    @Args('userId') userId: string, // temporary — later from JWT
  ) {
    return this.reviewsService.findMyReviews(userId);
  }

  // ─── DELETE REVIEW ───────────────────────────
  @Mutation(() => Boolean)
  removeReview(
    @Args('id') id: string,
    @Args('userId') userId: string, // temporary — later from JWT
  ) {
    return this.reviewsService.remove(id, userId);
  }
}