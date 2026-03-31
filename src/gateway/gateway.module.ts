import { Module } from '@nestjs/common';
import { BookingGateway } from './gateway.gateway';

@Module({
  providers: [BookingGateway],
  exports: [BookingGateway],  // ← export so bookings module can use it
})
export class GatewayModule {}