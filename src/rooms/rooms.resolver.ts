import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RoomsService } from './rooms.service';
import { RoomEntity } from './entities/room.entity';
import { CreateRoomInput } from './dto/create-room.dto';
import { UpdateRoomInput } from './dto/update-room.dto';

@Resolver(() => RoomEntity)
export class RoomsResolver {
  constructor(private roomsService: RoomsService) {}

  // ─── CREATE ROOM ─────────────────────────────
  @Mutation(() => RoomEntity)
  createRoom(
    @Args('input') input: CreateRoomInput,
    @Args('userId') userId: string, // temporary — later from JWT
  ) {
    return this.roomsService.create(input, userId);
  }

  // ─── GET ALL ROOMS FOR A HOTEL ───────────────
  @Query(() => [RoomEntity])
  findRoomsByHotel(@Args('hotelId') hotelId: string) {
    return this.roomsService.findByHotel(hotelId);
  }

  // ─── GET ONE ROOM ────────────────────────────
  @Query(() => RoomEntity)
  findRoom(@Args('id') id: string) {
    return this.roomsService.findOne(id);
  }

  // ─── UPDATE ROOM ─────────────────────────────
  @Mutation(() => RoomEntity)
  updateRoom(
    @Args('id') id: string,
    @Args('input') input: UpdateRoomInput,
    @Args('userId') userId: string, // temporary — later from JWT
  ) {
    return this.roomsService.update(id, input, userId);
  }

  // ─── DELETE ROOM ─────────────────────────────
  @Mutation(() => Boolean)
  removeRoom(
    @Args('id') id: string,
    @Args('userId') userId: string, // temporary — later from JWT
  ) {
    return this.roomsService.remove(id, userId);
  }

  // ─── CHECK AVAILABILITY ──────────────────────
  @Query(() => Boolean)
  checkRoomAvailability(
    @Args('roomId') roomId: string,
    @Args('checkIn') checkIn: Date,
    @Args('checkOut') checkOut: Date,
  ) {
    return this.roomsService.checkAvailability(roomId, checkIn, checkOut);
  }
}