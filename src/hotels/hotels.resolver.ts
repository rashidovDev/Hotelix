import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { HotelsService } from './hotels.service';
import { HotelEntity } from './entities/hotel.entity';
import { CreateHotelInput } from './dto/create-hotel.dto';
import { UpdateHotelInput } from './dto/update-hotel.dto';

@Resolver(() => HotelEntity)
export class HotelsResolver {
  constructor(private hotelsService: HotelsService) {}

  // ─── CREATE HOTEL ────────────────────────────
  @Mutation(() => HotelEntity)
  createHotel(
    @Args('input') input: CreateHotelInput,
    @Args('ownerId') ownerId: string, // temporary — later we get this from JWT
  ) {
    return this.hotelsService.create(input, ownerId);
  }

  // ─── GET ALL HOTELS ──────────────────────────
  @Query(() => [HotelEntity])
  findAllHotels() {
    return this.hotelsService.findAll();
  }

  // ─── SEARCH HOTELS ───────────────────────────
  @Query(() => [HotelEntity])
  searchHotels(
    @Args('city', { nullable: true }) city?: string,
    @Args('country', { nullable: true }) country?: string,
  ) {
    return this.hotelsService.search(city, country);
  }

  // ─── GET ONE HOTEL ───────────────────────────
  @Query(() => HotelEntity)
  findHotel(@Args('id') id: string) {
    return this.hotelsService.findOne(id);
  }

  // ─── UPDATE HOTEL ────────────────────────────
  @Mutation(() => HotelEntity)
  updateHotel(
    @Args('id') id: string,
    @Args('input') input: UpdateHotelInput,
    @Args('userId') userId: string, // temporary — later from JWT
  ) {
    return this.hotelsService.update(id, input, userId);
  }

  // ─── DELETE HOTEL ────────────────────────────
  @Mutation(() => Boolean)
  removeHotel(
    @Args('id') id: string,
    @Args('userId') userId: string, // temporary — later from JWT
  ) {
    return this.hotelsService.remove(id, userId);
  }

  // ─── MY HOTELS ───────────────────────────────
  @Query(() => [HotelEntity])
  myHotels(@Args('ownerId') ownerId: string) { // temporary — later from JWT
    return this.hotelsService.findMyHotels(ownerId);
  }
}