import { Module } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelsResolver } from './hotels.resolver';

@Module({
  providers: [HotelsService, HotelsResolver],
  exports: [HotelsService],
})
export class HotelsModule {}