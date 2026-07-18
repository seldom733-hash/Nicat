import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createRoom(body: {
        name: string;
        tourId?: string;
        memberIds?: string[];
    }, req: any): Promise<import("./entities").ChatRoom>;
    getUserRooms(req: any): Promise<import("./entities").ChatRoom[]>;
    getRoom(roomId: string, req: any): Promise<import("./entities").ChatRoom | {
        error: string;
    }>;
    getRoomMessages(roomId: string, req: any, page?: number, limit?: number): Promise<{
        messages: import("./entities").Message[];
        total: number;
    } | {
        error: string;
    }>;
    sendMessage(roomId: string, body: {
        content: string;
        type?: string;
    }, req: any): Promise<import("./entities").Message | {
        error: string;
    }>;
    markAsRead(roomId: string, messageId: string, req: any): Promise<{
        success: boolean;
    }>;
}
