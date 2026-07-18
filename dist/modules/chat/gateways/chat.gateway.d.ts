import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from '../chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    private readonly jwtService;
    server: Server;
    private readonly logger;
    private readonly onlineUsers;
    constructor(chatService: ChatService, jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleMessage(client: Socket, data: {
        roomId: string;
        content: string;
        type?: string;
    }): Promise<{
        success: boolean;
        message: import("../entities").Message;
    }>;
    handleJoinRoom(client: Socket, data: {
        roomId: string;
    }): Promise<{
        success: boolean;
    }>;
    handleLeaveRoom(client: Socket, data: {
        roomId: string;
    }): Promise<{
        success: boolean;
    }>;
    handleTyping(client: Socket, data: {
        roomId: string;
        isTyping: boolean;
    }): Promise<void>;
    handleMarkAsRead(client: Socket, data: {
        roomId: string;
        messageId: string;
    }): Promise<{
        success: boolean;
    }>;
    handleGetOnlineUsers(): Promise<string[]>;
    broadcastToRoom(roomId: string, event: string, data: any): void;
}
