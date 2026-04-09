import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionEntity } from './entities/subscription.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';


@Resolver(() => SubscriptionEntity)
export class SubscriptionsResolver {
  constructor(private subscriptionsService: SubscriptionsService) {}

  // ─── SUBSCRIBE ───────────────────────────────
  @UseGuards(JwtGuard)
  @Mutation(() => SubscriptionEntity)
  subscribeToHotel(
    @Args('hotelId') hotelId: string,
    @CurrentUser() user: any,
  ) {
    return this.subscriptionsService.subscribe(user.id, hotelId);
  }

  // ─── UNSUBSCRIBE ─────────────────────────────
  @UseGuards(JwtGuard)
  @Mutation(() => Boolean)
  unsubscribeFromHotel(
    @Args('hotelId') hotelId: string,
    @CurrentUser() user: any,
  ) {
    return this.subscriptionsService.unsubscribe(user.id, hotelId);
  }

  // ─── MY SUBSCRIPTIONS ────────────────────────
  @UseGuards(JwtGuard)
  @Query(() => [SubscriptionEntity])
  mySubscriptions(@CurrentUser() user: any) {
    return this.subscriptionsService.mySubscriptions(user.id);
  }

  // ─── CHECK IF SUBSCRIBED ─────────────────────
  @UseGuards(JwtGuard)
  @Query(() => Boolean)
  isSubscribed(
    @Args('hotelId') hotelId: string,
    @CurrentUser() user: any,
  ) {
    return this.subscriptionsService.isSubscribed(user.id, hotelId);
  }
}