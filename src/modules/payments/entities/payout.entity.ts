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

export enum PayoutStatus {
  PENDING = 'pending',
  IN_TRANSIT = 'in_transit',
  PAID = 'paid',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('payouts')
@Index(['userId', 'status'])
@Index(['stripePayoutId'])
@Index(['createdAt'])
export class Payout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  stripePayoutId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({
    type: 'enum',
    enum: PayoutStatus,
    default: PayoutStatus.PENDING,
  })
  status: PayoutStatus;

  @Column({ type: 'varchar', length: 100, nullable: true })
  type: string;

  @Column({ type: 'timestamp', nullable: true })
  arrivalDate: Date;

  @Column({ type: 'text', nullable: true })
  failureReason: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  balanceTransactionId: string;

  @CreateDateColumn()
  createdAt: Date;
}
