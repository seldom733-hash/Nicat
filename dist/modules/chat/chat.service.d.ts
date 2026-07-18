import { Repository } from 'typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { Message } from './entities/message.entity';
import { ChatMember } from './entities/chat-member.entity';
import { UsersService } from '../users/users.service';
export declare class ChatService {
    private readonly chatRoomRepository;
    private readonly messageRepository;
    private readonly chatMemberRepository;
    private readonly usersService;
    constructor(chatRoomRepository: Repository<ChatRoom>, messageRepository: Repository<Message>, chatMemberRepository: Repository<ChatMember>, usersService: UsersService);
    createRoom(name: string, tourId: string, memberIds: string[]): Promise<ChatRoom>;
    findById(id: string): Promise<ChatRoom>;
    findByTourId(tourId: string): Promise<ChatRoom | null>;
    getUserRooms(userId: string): Promise<ChatRoom[]>;
    createMessage(data: {
        chatRoomId: string;
        senderId: string;
        content: string;
        type?: string;
        fileUrl?: string;
    }): Promise<Message>;
    getRoomMessages(roomId: string, page?: number, limit?: number): Promise<{
        messages: Message[];
        total: number;
    }>;
    markAsRead(roomId: string, userId: string, messageId: string): Promise<void>;
    isMember(roomId: string, userId: string): Promise<boolean>;
    addMember(roomId: string, userId: string): Promise<void>;
    removeMember(roomId: string, userId: string): Promise<void>;
}
