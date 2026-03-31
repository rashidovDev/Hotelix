import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // in production replace with your frontend URL
  },
})
export class BookingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // ─── CONNECTION TRACKING ─────────────────────
  handleConnection(client: Socket) {
    console.log(`Client connected:    ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // ─── JOIN HOTEL ROOM ─────────────────────────
  // client calls this when they open a hotel page
  @SubscribeMessage('joinHotel')
  handleJoinHotel(
    @MessageBody() hotelId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`hotel:${hotelId}`);
    console.log(`Client ${client.id} joined hotel:${hotelId}`);
    return { event: 'joinedHotel', hotelId };
  }

  // ─── LEAVE HOTEL ROOM ────────────────────────
  // client calls this when they leave the hotel page
  @SubscribeMessage('leaveHotel')
  handleLeaveHotel(
    @MessageBody() hotelId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`hotel:${hotelId}`);
    console.log(`Client ${client.id} left hotel:${hotelId}`);
    return { event: 'leftHotel', hotelId };
  }

  // ─── EMIT ROOM BOOKED ────────────────────────
  // called internally when a booking is confirmed
  notifyRoomBooked(hotelId: string, roomId: string) {
    this.server.to(`hotel:${hotelId}`).emit('roomBooked', {
      roomId,
      message: 'This room was just booked',
    });
  }

  // ─── EMIT ROOM AVAILABLE ─────────────────────
  // called internally when a booking is cancelled
  notifyRoomAvailable(hotelId: string, roomId: string) {
    this.server.to(`hotel:${hotelId}`).emit('roomAvailable', {
      roomId,
      message: 'This room is now available',
    });
  }
}