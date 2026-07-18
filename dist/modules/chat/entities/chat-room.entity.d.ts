import { Message } from './message.entity';
import { ChatMember } from './chat-member.entity';
export declare class ChatRoom {
    id: string;
    name: string;
    type: string;
    tourId: string;
    members: ChatMember[];
    messages: Message[];
    lastMessageId: string;
    lastMessageAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
