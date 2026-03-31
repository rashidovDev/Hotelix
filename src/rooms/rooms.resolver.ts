import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomEntity } from './entities/room.entity';
import { CreateRoomInput } from './dto/create-room.dto';
import { UpdateRoomInput } from './dto/update-room.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';

@Resolver(() => RoomEntity)
export class RoomsResolver {
  constructor(private roomsService: RoomsService) {}

  // public
  @Query(() => [RoomEntity])
  findRoomsByHotel(@Args('hotelId') hotelId: string) {
    return this.roomsService.findByHotel(hotelId);
  }

  // public
  @Query(() => RoomEntity)
  findRoom(@Args('id') id: string) {
    return this.roomsService.findOne(id);
  }

  // public
  @Query(() => Boolean)
  checkRoomAvailability(
    @Args('roomId') roomId: string,
    @Args('checkIn') checkIn: Date,
    @Args('checkOut') checkOut: Date,
  ) {
    return this.roomsService.checkAvailability(roomId, checkIn, checkOut);
  }

  // protected — only HOST
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.HOST, Role.ADMIN)
  @Mutation(() => RoomEntity)
  createRoom(
    @Args('input') input: CreateRoomInput,
    @CurrentUser() user: any,
  ) {
    return this.roomsService.create(input, user.id);
  }

  // protected — only HOST
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.HOST, Role.ADMIN)
  @Mutation(() => RoomEntity)
  updateRoom(
    @Args('id') id: string,
    @Args('input') input: UpdateRoomInput,
    @CurrentUser() user: any,
  ) {
    return this.roomsService.update(id, input, user.id);
  }

  // protected — only HOST
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.HOST, Role.ADMIN)
  @Mutation(() => Boolean)
  removeRoom(
    @Args('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.roomsService.remove(id, user.id);
  }
}