"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const chat_service_1 = require("../chat.service");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    chatService;
    jwtService;
    server;
    logger = new common_1.Logger(ChatGateway_1.name);
    onlineUsers = new Map();
    constructor(chatService, jwtService) {
        this.chatService = chatService;
        this.jwtService = jwtService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token || client.handshake.query.token;
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            const userId = payload.sub;
            client.data.userId = userId;
            this.onlineUsers.set(userId, client.id);
            const rooms = await this.chatService.getUserRooms(userId);
            rooms.forEach((room) => client.join(room.id));
            this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
        }
        catch (error) {
            this.logger.error('Connection error:', error.message);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const userId = client.data.userId;
        if (userId) {
            this.onlineUsers.delete(userId);
        }
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    async handleMessage(client, data) {
        const userId = client.data.userId;
        const message = await this.chatService.createMessage({
            chatRoomId: data.roomId,
            senderId: userId,
            content: data.content,
            type: data.type || 'text',
        });
        this.server.to(data.roomId).emit('newMessage', {
            ...message,
            sender: { id: userId },
        });
        return { success: true, message };
    }
    async handleJoinRoom(client, data) {
        client.join(data.roomId);
        return { success: true };
    }
    async handleLeaveRoom(client, data) {
        client.leave(data.roomId);
        return { success: true };
    }
    async handleTyping(client, data) {
        const userId = client.data.userId;
        client.to(data.roomId).emit('userTyping', {
            userId,
            isTyping: data.isTyping,
        });
    }
    async handleMarkAsRead(client, data) {
        const userId = client.data.userId;
        await this.chatService.markAsRead(data.roomId, userId, data.messageId);
        return { success: true };
    }
    async handleGetOnlineUsers() {
        return Array.from(this.onlineUsers.keys());
    }
    broadcastToRoom(roomId, event, data) {
        this.server.to(roomId).emit(event, data);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('markAsRead'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMarkAsRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getOnlineUsers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGetOnlineUsers", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        jwt_1.JwtService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map