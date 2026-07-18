import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ChatRoom } from './chat-room.entity';

@Entity('chat_members')
export class ChatMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ChatRoom, (room) => room.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom: ChatRoom;

  @Column({ type: 'uuid' })
  chatRoomId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'boolean', default: false })
  isOnline: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastSeenAt: Date;

  @Column({ type: 'uuid', nullable: true })
  lastReadMessageId: string;

  @Column({ type: 'boolean', default: false })
  isMuted: boolean;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  joinedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
