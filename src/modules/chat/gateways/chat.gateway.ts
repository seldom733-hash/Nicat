import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from '../chat.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private readonly onlineUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.query.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token as string);
      const userId = payload.sub;

      client.data.userId = userId;
      this.onlineUsers.set(userId, client.id);

      // Join all user's chat rooms
      const rooms = await this.chatService.getUserRooms(userId);
      rooms.forEach((room) => client.join(room.id));

      this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
    } catch (error) {
      this.logger.error('Connection error:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.onlineUsers.delete(userId);
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; content: string; type?: string },
  ) {
    const userId = client.data.userId;

    const message = await this.chatService.createMessage({
      chatRoomId: data.roomId,
      senderId: userId,
      content: data.content,
      type: data.type || 'text',
    });

    // Emit to all room members
    this.server.to(data.roomId).emit('newMessage', {
      ...message,
      sender: { id: userId },
    });

    return { success: true, message };
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    client.join(data.roomId);
    return { success: true };
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    client.leave(data.roomId);
    return { success: true };
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; isTyping: boolean },
  ) {
    const userId = client.data.userId;
    client.to(data.roomId).emit('userTyping', {
      userId,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; messageId: string },
  ) {
    const userId = client.data.userId;
    await this.chatService.markAsRead(data.roomId, userId, data.messageId);
    return { success: true };
  }

  @SubscribeMessage('getOnlineUsers')
  async handleGetOnlineUsers() {
    return Array.from(this.onlineUsers.keys());
  }

  // Public method to broadcast to a room
  broadcastToRoom(roomId: string, event: string, data: any) {
    this.server.to(roomId).emit(event, data);
  }
}
