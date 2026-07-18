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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chat_room_entity_1 = require("./entities/chat-room.entity");
const message_entity_1 = require("./entities/message.entity");
const chat_member_entity_1 = require("./entities/chat-member.entity");
const users_service_1 = require("../users/users.service");
let ChatService = class ChatService {
    chatRoomRepository;
    messageRepository;
    chatMemberRepository;
    usersService;
    constructor(chatRoomRepository, messageRepository, chatMemberRepository, usersService) {
        this.chatRoomRepository = chatRoomRepository;
        this.messageRepository = messageRepository;
        this.chatMemberRepository = chatMemberRepository;
        this.usersService = usersService;
    }
    async createRoom(name, tourId, memberIds) {
        const room = this.chatRoomRepository.create({
            name,
            type: 'tour',
            tourId,
        });
        const savedRoom = await this.chatRoomRepository.save(room);
        const members = memberIds.map((userId) => this.chatMemberRepository.create({
            chatRoomId: savedRoom.id,
            userId,
        }));
        await this.chatMemberRepository.save(members);
        return this.findById(savedRoom.id);
    }
    async findById(id) {
        const room = await this.chatRoomRepository.findOne({
            where: { id },
            relations: { members: true },
        });
        if (!room) {
            throw new common_1.NotFoundException('Chat room not found');
        }
        return room;
    }
    async findByTourId(tourId) {
        return this.chatRoomRepository.findOne({
            where: { tourId },
            relations: { members: true },
        });
    }
    async getUserRooms(userId) {
        const members = await this.chatMemberRepository.find({
            where: { userId },
            relations: { chatRoom: true },
        });
        return members.map((m) => m.chatRoom);
    }
    async createMessage(data) {
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
        return result;
    }
    async getRoomMessages(roomId, page = 1, limit = 50) {
        const [messages, total] = await this.messageRepository.findAndCount({
            where: { chatRoomId: roomId },
            relations: { sender: true },
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { messages: messages.reverse(), total };
    }
    async markAsRead(roomId, userId, messageId) {
        await this.chatMemberRepository.update({ chatRoomId: roomId, userId }, { lastReadMessageId: messageId });
    }
    async isMember(roomId, userId) {
        const member = await this.chatMemberRepository.findOne({
            where: { chatRoomId: roomId, userId },
        });
        return !!member;
    }
    async addMember(roomId, userId) {
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
    async removeMember(roomId, userId) {
        await this.chatMemberRepository.delete({ chatRoomId: roomId, userId });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_room_entity_1.ChatRoom)),
    __param(1, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(2, (0, typeorm_1.InjectRepository)(chat_member_entity_1.ChatMember)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService])
], ChatService);
//# sourceMappingURL=chat.service.js.map