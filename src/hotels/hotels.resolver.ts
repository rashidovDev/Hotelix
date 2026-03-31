import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelEntity } from './entities/hotel.entity';
import { CreateHotelInput } from './dto/create-hotel.dto';
import { UpdateHotelInput } from './dto/update-hotel.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';

@Resolver(() => HotelEntity)
export class HotelsResolver {
  constructor(private hotelsService: HotelsService) {}

  // public — anyone can view hotels
  @Query(() => [HotelEntity])
  findAllHotels() {
    return this.hotelsService.findAll();
  }

  // public — anyone can search
  @Query(() => [HotelEntity])
  searchHotels(
    @Args('city', { nullable: true }) city?: string,
    @Args('country', { nullable: true }) country?: string,
  ) {
    return this.hotelsService.search(city, country);
  }

  // public — anyone can view a hotel
  @Query(() => HotelEntity)
  findHotel(@Args('id') id: string) {
    return this.hotelsService.findOne(id);
  }

  // protected — only HOST can create
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.HOST, Role.ADMIN)
  @Mutation(() => HotelEntity)
  createHotel(
    @Args('input') input: CreateHotelInput,
    @CurrentUser() user: any,   // ← automatically from token
  ) {
    return this.hotelsService.create(input, user.id);
  }

  // protected — only HOST can update their hotel
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.HOST, Role.ADMIN)
  @Mutation(() => HotelEntity)
  updateHotel(
    @Args('id') id: string,
    @Args('input') input: UpdateHotelInput,
    @CurrentUser() user: any,
  ) {
    return this.hotelsService.update(id, input, user.id);
  }

  // protected — only HOST can delete their hotel
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.HOST, Role.ADMIN)
  @Mutation(() => HotelEntity)
  removeHotel(
    @Args('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.hotelsService.remove(id, user.id);
  }

  // protected — HOST sees their own hotels
  @UseGuards(JwtGuard)
  @Query(() => [HotelEntity])
  myHotels(@CurrentUser() user: any) {
    return this.hotelsService.findMyHotels(user.id);
  }
}