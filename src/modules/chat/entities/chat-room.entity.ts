import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Message } from './message.entity';
import { ChatMember } from './chat-member.entity';

@Entity('chat_rooms')
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50, default: 'tour' })
  type: string; // tour, direct

  @Column({ type: 'uuid', nullable: true })
  tourId: string;

  @OneToMany(() => ChatMember, (member) => member.chatRoom)
  members: ChatMember[];

  @OneToMany(() => Message, (message) => message.chatRoom)
  messages: Message[];

  @Column({ type: 'uuid', nullable: true })
  lastMessageId: string;

  @Column({ type: 'timestamp', nullable: true })
  lastMessageAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
