import { User } from '../../users/entities/user.entity';
import { ChatRoom } from './chat-room.entity';
export declare class Message {
    id: string;
    chatRoom: ChatRoom;
    chatRoomId: string;
    sender: User;
    senderId: string;
    content: string;
    type: string;
    fileUrl: string;
    isEdited: boolean;
    isDeleted: boolean;
    createdAt: Date;
}
