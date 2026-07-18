import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ChatRoom } from './chat-room.entity';

@Entity('messages')
@Index(['chatRoomId', 'createdAt'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ChatRoom, (room) => room.messages)
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom: ChatRoom;

  @Column({ type: 'uuid' })
  chatRoomId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column({ type: 'uuid' })
  senderId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 50, default: 'text' })
  type: string; // text, image, file

  @Column({ type: 'text', nullable: true })
  fileUrl: string;

  @Column({ type: 'boolean', default: false })
  isEdited: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
