import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { Message } from './entities/message.entity';
import { ChatMember } from './entities/chat-member.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(ChatMember)
    private readonly chatMemberRepository: Repository<ChatMember>,
    private readonly usersService: UsersService,
  ) {}

  async createRoom(name: string, tourId: string, memberIds: string[]): Promise<ChatRoom> {
    const room = this.chatRoomRepository.create({
      name,
      type: 'tour',
      tourId,
    });

    const savedRoom = await this.chatRoomRepository.save(room);

    const members = memberIds.map((userId) =>
      this.chatMemberRepository.create({
        chatRoomId: savedRoom.id,
        userId,
      }),
    );

    await this.chatMemberRepository.save(members);
    return this.findById(savedRoom.id);
  }

  async findById(id: string): Promise<ChatRoom> {
    const room = await this.chatRoomRepository.findOne({
      where: { id },
      relations: { members: true },
    });
    if (!room) {
      throw new NotFoundException('Chat room not found');
    }
    return room;
  }

  async findByTourId(tourId: string): Promise<ChatRoom | null> {
    return this.chatRoomRepository.findOne({
      where: { tourId },
      relations: { members: true },
    });
  }

  async getUserRooms(userId: string): Promise<ChatRoom[]> {
    const members = await this.chatMemberRepository.find({
      where: { userId },
      relations: { chatRoom: true },
    });

    return members.map((m) => m.chatRoom);
  }

  async createMessage(data: {
    chatRoomId: string;
    senderId: string;
    content: string;
    type?: string;
    fileUrl?: string;
  }): Promise<Message> {
    const message = this.messageRepository.create({
      chatRoomId: data.chatRoomId,
      senderId: data.senderId,
      content: data.content,
      type: data.type || 'text',
      fileUrl: data.fileUrl,
    });

    const savedMessage = await this.messageRepository.save(message);

    await this.chatRoomRepository.update(data.chatRoomId, {
      lastMessageId: savedMessage.id,
      lastMessageAt: new Date(),
    });

    const result = await this.messageRepository.findOne({
      where: { id: savedMessage.id },
      relations: { sender: true },
    });

    return result!;
  }

  async getRoomMessages(
    roomId: string,
    page = 1,
    limit = 50,
  ): Promise<{ messages: Message[]; total: number }> {
    const [messages, total] = await this.messageRepository.findAndCount({
      where: { chatRoomId: roomId },
      relations: { sender: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { messages: messages.reverse(), total };
  }

  async markAsRead(roomId: string, userId: string, messageId: string): Promise<void> {
    await this.chatMemberRepository.update(
      { chatRoomId: roomId, userId },
      { lastReadMessageId: messageId },
    );
  }

  async isMember(roomId: string, userId: string): Promise<boolean> {
    const member = await this.chatMemberRepository.findOne({
      where: { chatRoomId: roomId, userId },
    });
    return !!member;
  }

  async addMember(roomId: string, userId: string): Promise<void> {
    const existing = await this.chatMemberRepository.findOne({
      where: { chatRoomId: roomId, userId },
    });

    if (!existing) {
      const member = this.chatMemberRepository.create({
        chatRoomId: roomId,
        userId,
      });
      await this.chatMemberRepository.save(member);
    }
  }

  async removeMember(roomId: string, userId: string): Promise<void> {
    await this.chatMemberRepository.delete({ chatRoomId: roomId, userId });
  }
}
