import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

import { GatewayModule } from '../gateway/gateway.module';
import { SubscriptionsResolver } from './subscription.resolver';

@Module({
  imports: [GatewayModule],
  providers: [SubscriptionsService, SubscriptionsResolver],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}