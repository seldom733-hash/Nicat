import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Tour } from '../../tours/entities/tour.entity';
import { User } from '../../users/entities/user.entity';

@Entity('tour_views')
@Index(['tourId', 'viewedAt'])
@Index(['userId', 'viewedAt'])
export class TourView {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tour, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tourId' })
  tour: Tour;

  @Column({ type: 'uuid' })
  tourId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ type: 'varchar', length: 50, default: 'direct' })
  source: string; // search, direct, chat, social, email, referral

  @Column({ type: 'varchar', length: 100, nullable: true })
  deviceType: string; // desktop, mobile, tablet

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referrerUrl: string;

  @Column({ type: 'int', nullable: true })
  sessionDuration: number; // seconds on tour detail page

  @CreateDateColumn()
  viewedAt: Date;
}
