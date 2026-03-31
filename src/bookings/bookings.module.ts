import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsResolver } from './bookings.resolver';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [GatewayModule],   // ← import gateway
  providers: [BookingsService, BookingsResolver],
  exports: [BookingsService],
})
export class BookingsModule {}