import { User } from '../../users/entities/user.entity';
import { ChatRoom } from './chat-room.entity';
export declare class ChatMember {
    id: string;
    chatRoom: ChatRoom;
    chatRoomId: string;
    user: User;
    userId: string;
    isOnline: boolean;
    lastSeenAt: Date;
    lastReadMessageId: string;
    isMuted: boolean;
    isAdmin: boolean;
    joinedAt: Date;
    updatedAt: Date;
}
