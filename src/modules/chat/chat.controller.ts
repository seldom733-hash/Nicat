import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('rooms')
  @HttpCode(HttpStatus.CREATED)
  async createRoom(
    @Body() body: { name: string; tourId?: string; memberIds?: string[] },
    @Request() req,
  ) {
    const memberIds = [...new Set([req.user.id, ...(body.memberIds || [])])];
    return this.chatService.createRoom(body.name, body.tourId || '', memberIds);
  }

  @Get('rooms')
  async getUserRooms(@Request() req) {
    return this.chatService.getUserRooms(req.user.id);
  }

  @Get('rooms/:roomId')
  async getRoom(@Param('roomId') roomId: string, @Request() req) {
    const isMember = await this.chatService.isMember(roomId, req.user.id);
    if (!isMember) {
      return { error: 'Not a member of this room' };
    }
    return this.chatService.findById(roomId);
  }

  @Get('rooms/:roomId/messages')
  async getRoomMessages(
    @Param('roomId') roomId: string,
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const isMember = await this.chatService.isMember(roomId, req.user.id);
    if (!isMember) {
      return { error: 'Not a member of this room' };
    }
    return this.chatService.getRoomMessages(roomId, page, limit);
  }

  @Post('rooms/:roomId/messages')
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @Param('roomId') roomId: string,
    @Body() body: { content: string; type?: string },
    @Request() req,
  ) {
    const isMember = await this.chatService.isMember(roomId, req.user.id);
    if (!isMember) {
      return { error: 'Not a member of this room' };
    }
    return this.chatService.createMessage({
      chatRoomId: roomId,
      senderId: req.user.id,
      content: body.content,
      type: body.type,
    });
  }

  @Post('rooms/:roomId/read')
  @HttpCode(HttpStatus.OK)
  async markAsRead(
    @Param('roomId') roomId: string,
    @Body('messageId') messageId: string,
    @Request() req,
  ) {
    await this.chatService.markAsRead(roomId, req.user.id, messageId);
    return { success: true };
  }
}
