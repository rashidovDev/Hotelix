import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewEntity } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';

@Resolver(() => ReviewEntity)
export class ReviewsResolver {
  constructor(private reviewsService: ReviewsService) {}

  // public — anyone can read reviews
  @Query(() => [ReviewEntity])
  hotelReviews(@Args('hotelId') hotelId: string) {
    return this.reviewsService.findByHotel(hotelId);
  }

  // protected — must be logged in
  @UseGuards(JwtGuard)
  @Mutation(() => ReviewEntity)
  createReview(
    @Args('input') input: CreateReviewInput,
    @CurrentUser() user: any,
  ) {
    return this.reviewsService.create(input, user.id);
  }

  // protected
  @UseGuards(JwtGuard)
  @Query(() => [ReviewEntity])
  myReviews(@CurrentUser() user: any) {
    return this.reviewsService.findMyReviews(user.id);
  }

  // protected
  @UseGuards(JwtGuard)
  @Mutation(() => Boolean)
  removeReview(
    @Args('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.reviewsService.remove(id, user.id);
  }
}