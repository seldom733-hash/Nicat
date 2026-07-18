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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ChatController = class ChatController {
    chatService;
    constructor(chatService) {
        this.chatService = chatService;
    }
    async createRoom(body, req) {
        const memberIds = [...new Set([req.user.id, ...(body.memberIds || [])])];
        return this.chatService.createRoom(body.name, body.tourId || '', memberIds);
    }
    async getUserRooms(req) {
        return this.chatService.getUserRooms(req.user.id);
    }
    async getRoom(roomId, req) {
        const isMember = await this.chatService.isMember(roomId, req.user.id);
        if (!isMember) {
            return { error: 'Not a member of this room' };
        }
        return this.chatService.findById(roomId);
    }
    async getRoomMessages(roomId, req, page, limit) {
        const isMember = await this.chatService.isMember(roomId, req.user.id);
        if (!isMember) {
            return { error: 'Not a member of this room' };
        }
        return this.chatService.getRoomMessages(roomId, page, limit);
    }
    async sendMessage(roomId, body, req) {
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
    async markAsRead(roomId, messageId, req) {
        await this.chatService.markAsRead(roomId, req.user.id, messageId);
        return { success: true };
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('rooms'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createRoom", null);
__decorate([
    (0, common_1.Get)('rooms'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getUserRooms", null);
__decorate([
    (0, common_1.Get)('rooms/:roomId'),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getRoom", null);
__decorate([
    (0, common_1.Get)('rooms/:roomId/messages'),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Number, Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getRoomMessages", null);
__decorate([
    (0, common_1.Post)('rooms/:roomId/messages'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)('rooms/:roomId/read'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Body)('messageId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "markAsRead", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map