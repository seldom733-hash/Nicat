import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum StripeEventStatus {
  RECEIVED = 'received',
  PROCESSING = 'processing',
  PROCESSED = 'processed',
  FAILED = 'failed',
  IGNORED = 'ignored',
}

@Entity('stripe_events')
@Index(['stripeEventId'], { unique: true })
@Index(['eventType'])
@Index(['status'])
@Index(['createdAt'])
export class StripeEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  stripeEventId: string;

  @Column({ type: 'varchar', length: 100 })
  eventType: string;

  @Column({
    type: 'enum',
    enum: StripeEventStatus,
    default: StripeEventStatus.RECEIVED,
  })
  status: StripeEventStatus;

  @Column({ type: 'jsonb', nullable: true })
  payload: any;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'int', default: 0 })
  retryCount: number;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
